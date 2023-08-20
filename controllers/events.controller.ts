import { Request, Response } from "express";
import { EmailQueue, RedisClient } from "../services/bullmq.service";
import {parse} from "ua-parser"
/**
 * 
 * @param req Express Request
 * @param res Express Response
 * Executed when the user opens an email
 * Sends back a base64 string containing image
 */
export async function GetEmailOpenEvent(req:Request,res:Response){
    const {userEmail}=req.query
    const userAgent= parse(req.headers["user-agent"])
    await EmailQueue.add('emailOpenEvent',{user_email:userEmail,os:userAgent.os.toString(),device:userAgent.device.family})
    res.set('Content-Type','image/png')
    //transperent pixel image
    res.send(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAwAB/7AYf5T8AAAAASUVORK5CYII=', 'base64'))
}
/**
 * 
 * @param attribute String
 * @returns dictionary containing the number of opens per attribute
 */
async function calculateOpensByAttribute(attribute:string){
    const allEventKeys=await RedisClient.hkeys('emailOpenEventCounts')
    const opensByAttribute={ }

    for(const key of allEventKeys){
        const [,attrtype,value]=key.split('|')
        if(value && attrtype===attribute){
            const data=await RedisClient.hget('emailOpenEventCounts',key)
            opensByAttribute[value]=(parseInt(opensByAttribute[value])||0)+parseInt(data?data:'')
        }
    }
    
    return opensByAttribute

}
/**
 * 
 * @param req Express Request
 * @param res Express Response
 * Sends the metrics(timeseries data, number of opens based on os, device, email)
 */

export async function GetMetrics(req:Request,res:Response){
    const currentTime = Date.now()
  const timeSeriesData:any[] = []

  // Retrieve event counts for the last 6 minutes (adjust the timeframe as needed)
  for (let i = 0; i < 10; i++) {
    const timestamp = currentTime - i * 60 * 1000
    const time = new Date(timestamp).toISOString().substring(0, 16)
    const totalOpens = await RedisClient.hget('emailOpenEventCounts', time) || 0

    timeSeriesData.push({ total_opens: parseInt(totalOpens?totalOpens:'0'),time: new Date(timestamp).toLocaleString() })
  }
 
  const opensByOS = await calculateOpensByAttribute('os')
  const opensByDevices = await calculateOpensByAttribute('device')

  const metrics = {
    opens_by_os:opensByOS,//opens based on OS
    opens_by_device:opensByDevices,//opens based on devices
    timeseries: timeSeriesData,//opens per minute
  }

  res.json(metrics)
}
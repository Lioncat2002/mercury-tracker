import { Request, Response } from "express";
import { EmailQueue, RedisClient } from "../services/bullmq.service";

export async function GetEmailOpenEvent(req:Request,res:Response){
    const {userEmail}=req.query
    await EmailQueue.add('emailOpenEvent',{userEmail})
    res.set('Content-Type','image/png')
    //transperent pixel image
    res.send(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAwAB/7AYf5T8AAAAASUVORK5CYII=', 'base64'));
}

export async function GetMetrics(req:Request,res:Response){
    const currentTime = Date.now();
  const timeSeriesData = [];

  // Retrieve event counts for the last 6 minutes (adjust the timeframe as needed)
  for (let i = 0; i < 6; i++) {
    const timestamp = currentTime - i * 60 * 1000;
    const time = new Date(timestamp).toISOString().substring(0, 16);
    console.log(time)
    const totalOpens = await RedisClient.hget('emailOpenEventCounts', time) || 0;
    timeSeriesData.push({ totalOpens: totalOpens,time: new Date(timestamp).toLocaleString() });
  }
/* 
  const opensByCountries = await calculateOpensByAttribute('country');
  const opensByDevices = await calculateOpensByAttribute('device'); */

  const metrics = {
    timeseries: timeSeriesData,

  };

  res.json(metrics);
}
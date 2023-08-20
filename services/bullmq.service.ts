import { Queue, Worker } from 'bullmq';
import { Redis } from "ioredis"

export let EmailQueue:Queue
export let RedisClient:Redis
const connection={
    host: process.env.REDIS_HOST,
    port: 18467,
    password:process.env.REDIS_PASS
}
export function InitQueue(){
    EmailQueue=new Queue("emailQueue",{connection: connection})
    RedisClient=new Redis(connection)
}
export function setUpWorker(){
    const worker=new Worker('emailQueue',async job=>{
        const { user_email,os,device } = job.data;
        const currentTime = new Date();
        const minKey = currentTime.toISOString().substring(0, 16); // Group by min
        const osKey=`${minKey}|os|${os}`
        const deviceKey=`${minKey}|device|${device}`
        await RedisClient.hincrby('emailOpenEventCounts', minKey, 1)//Calculates number of opens per minute
        await RedisClient.hincrby('emailOpenEventCounts',osKey,1)//Calculates number of opens based on os
        await RedisClient.hincrby('emailOpenEventCounts',deviceKey,1)//Calculates number of opens based on device
        return Promise.resolve();
    },{
       connection: connection,
    })
    return worker
}
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
        const { userEmail } = job.data;
        const currentTime = new Date();
        const minKey = currentTime.toISOString().substring(0, 16); // Group by min
        console.log(minKey)
        await RedisClient.hincrby('emailOpenEventCounts', minKey, 1);
        return Promise.resolve("meow");
    },{
       connection: connection,
    })
    return worker
}
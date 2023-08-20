import express, { Express, Request, Response } from 'express';
import { InitQueue, setUpWorker } from './services/bullmq.service';
import { GetEmailOpenEvent, GetMetrics } from './controllers/events.controller';
import cron from "node-cron"


const app: Express = express();
const port = process.env.PORT||'3000';
//Initialize the RedisClient and Queue
InitQueue();
//Root 
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});
//GET: gets the image requested by the mail server and adds user data to job queue for processing
app.get('/event',GetEmailOpenEvent)
//GET: gets the metrics of emails opened and other data
app.get('/metrics',GetMetrics)
//Start express app
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at port: ${port}`);
  //Start the bullmq worker for processing the email events
  const worker=setUpWorker()
  //setup a cron job to run every minute
  cron.schedule('* * * * *', async () => {
    
   await worker.run()
  });
})
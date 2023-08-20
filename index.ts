import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { InitQueue, setUpWorker } from './services/bullmq.service';
import { GetEmailOpenEvent, GetMetrics } from './controllers/events.controller';
import cron from "node-cron"

dotenv.config();

const app: Express = express();
const port = process.env.PORT||'3000';

InitQueue();
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/event',GetEmailOpenEvent)
app.get('/metrics',GetMetrics)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  const worker=setUpWorker()
  cron.schedule('* * * * *', async () => {
    
   console.log(await worker.run()) 
  });
})
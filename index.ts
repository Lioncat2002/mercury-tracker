import express, { Express, Request, Response } from 'express';
import { InitQueue, setUpWorker } from './services/bullmq.service';
import { GetEmailOpenEvent, GetMetrics } from './controllers/events.controller';
import cron from "node-cron"


const app: Express = express();
const port = process.env.PORT||'3000';

InitQueue();
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/event',GetEmailOpenEvent)
app.get('/metrics',GetMetrics)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at port: ${port}`);
  const worker=setUpWorker()
  cron.schedule('* * * * *', async () => {
    
   await worker.run()
  });
})
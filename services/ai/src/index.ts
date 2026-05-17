import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { chatRouter } from './routes/chat.js';
import { translateRouter } from './routes/translate.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ai-school-ai', version: '1.0.0' });
});

app.use('/api/v1', authMiddleware);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/translate', translateRouter);

app.listen(PORT, () => {
  console.log(`AI service listening on port ${PORT}`);
});

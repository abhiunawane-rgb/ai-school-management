import { Router } from 'express';
import OpenAI from 'openai';
import { z } from 'zod';

export const chatRouter = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const chatSchema = z.object({
  tenantId: z.string(),
  userId: z.string(),
  message: z.string().min(1).max(4000),
  language: z.string().default('en'),
  context: z
    .object({
      role: z.string(),
      studentGrade: z.string().optional(),
    })
    .optional(),
});

chatRouter.post('/', async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { message, language, context } = parsed.data;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an AI school assistant. Respond in ${language}. User role: ${context?.role ?? 'parent'}. Be helpful, concise, and school-appropriate.`,
      },
      { role: 'user', content: message },
    ],
    max_tokens: 1024,
  });

  const reply = completion.choices[0]?.message?.content ?? '';
  res.json({ reply, sessionId: `sess_${Date.now()}` });
});

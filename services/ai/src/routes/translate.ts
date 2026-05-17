import { Router } from 'express';
import OpenAI from 'openai';
import { z } from 'zod';

export const translateRouter = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const translateSchema = z.object({
  text: z.string().min(1).max(10000),
  targetLanguage: z.string().min(2).max(10),
  sourceLanguage: z.string().optional(),
});

translateRouter.post('/', async (req, res) => {
  const parsed = translateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }

  const { text, targetLanguage, sourceLanguage } = parsed.data;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Translate the following text to ${targetLanguage}. Return only the translation.${sourceLanguage ? ` Source: ${sourceLanguage}` : ''}`,
      },
      { role: 'user', content: text },
    ],
    max_tokens: 4096,
  });

  res.json({
    translatedText: completion.choices[0]?.message?.content ?? text,
    targetLanguage,
  });
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);

const articleSeed = [
  { slug: 'best-ai-tools-to-try-in-2026', title: 'Best AI Tools to Try in 2026', category: 'AI Tools' },
  { slug: 'best-ai-video-generators-in-2026', title: 'Best AI Video Generators in 2026', category: 'AI Video' },
  { slug: 'best-ai-writing-tools', title: 'Best AI Writing Tools', category: 'AI Writing' },
];

const toolSeed = [
  { slug: 'chatgpt', name: 'ChatGPT', category: 'AI Writing' },
  { slug: 'gemini', name: 'Gemini', category: 'AI Research' },
  { slug: 'runway', name: 'Runway', category: 'AI Video' },
];

const newsletterSchema = z.object({
  email: z.string().email(),
});

app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests. Please try again later.',
  }),
);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ToolPilot AI API' });
});

app.get('/api/articles', (req, res) => {
  res.json({ items: articleSeed });
});

app.get('/api/articles/:slug', (req, res) => {
  const article = articleSeed.find((item) => item.slug === req.params.slug);
  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }
  return res.json({ item: article });
});

app.get('/api/tools', (req, res) => {
  res.json({ items: toolSeed });
});

app.get('/api/tools/:slug', (req, res) => {
  const tool = toolSeed.find((item) => item.slug === req.params.slug);
  if (!tool) {
    return res.status(404).json({ message: 'Tool not found' });
  }
  return res.json({ item: tool });
});

app.post('/api/newsletter', (req, res) => {
  try {
    const data = newsletterSchema.parse(req.body);
    return res.status(201).json({ success: true, message: 'Subscription received', email: data.email });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }
});

app.listen(PORT, () => {
  console.log(`ToolPilot AI API running on http://localhost:${PORT}`);
});

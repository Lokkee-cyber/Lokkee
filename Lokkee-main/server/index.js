import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import connectDB from './src/config/database.js';
import articleRoutes from './src/routes/articleRoutes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);

const articleSeed = [
  { slug: 'best-ai-tools-to-try-in-2026', title: 'Best AI Tools to Try in 2026', category: 'AI Tools' },
  { slug: 'best-ai-video-generators-in-2026', title: 'Best AI Video Generators in 2026', category: 'AI Video' },
  { slug: 'best-ai-writing-tools', title: 'Best AI Writing Tools', category: 'AI Writing' },
];

const toolSeed = [
  { slug: 'chatgpt', name: 'ChatGPT', category: 'General AI' },
  { slug: 'gemini', name: 'Google Gemini', category: 'AI Research' },
  { slug: 'claude', name: 'Claude', category: 'AI Writing' },
  { slug: 'perplexity', name: 'Perplexity', category: 'AI Research' },
  { slug: 'microsoft-copilot', name: 'Microsoft Copilot', category: 'Productivity' },
  { slug: 'deepseek', name: 'DeepSeek', category: 'AI Research' },
  { slug: 'grok', name: 'Grok', category: 'General AI' },
  { slug: 'midjourney', name: 'Midjourney', category: 'AI Image' },
  { slug: 'ideogram', name: 'Ideogram', category: 'AI Image' },
  { slug: 'leonardo-ai', name: 'Leonardo AI', category: 'AI Image' },
  { slug: 'runway', name: 'Runway', category: 'AI Video' },
  { slug: 'openai-sora', name: 'OpenAI Sora', category: 'AI Video' },
  { slug: 'cursor', name: 'Cursor', category: 'AI Coding' },
  { slug: 'github-copilot', name: 'GitHub Copilot', category: 'AI Coding' },
  { slug: 'suno', name: 'Suno', category: 'AI Audio' },
];

const newsletterSchema = z.object({
  email: z.string().email(),
});

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
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

if (process.env.MONGODB_URI) {
  connectDB().catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });
} else {
  console.log('MongoDB not configured; running server without database connection.');
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LokkeeVerse API' });
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

app.use('/api/articles-db', articleRoutes);

app.listen(PORT, () => {
  console.log(`LokkeeVerse server running on http://localhost:${PORT}`);
});

export default app;
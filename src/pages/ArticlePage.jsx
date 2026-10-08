import { Link, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { publishedArticles } from '../data/articles';
import ArticleCard from '../components/ArticleCard';
import Newsletter from '../components/Newsletter';
import AdSlot from '../components/AdSlot';
import SEO from '../components/SEO';
import NotFoundPage from './NotFoundPage';

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      blocks.push(
        <Typography key={index} variant={heading[1].length === 2 ? 'h4' : 'h5'} fontWeight={800}>
          {heading[2]}
        </Typography>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith('- ')) {
      const items = [];
      while (index < lines.length && lines[index].trim().startsWith('- ')) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push(
        <Box component="ul" key={`list-${index}`} sx={{ pl: 3, my: 0 }}>
          {items.map((item, itemIndex) => <li key={`${itemIndex}-${item}`}>{item}</li>)}
        </Box>,
      );
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{2,3})\s+/.test(lines[index].trim()) && !lines[index].trim().startsWith('- ')) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(
      <Typography key={`paragraph-${index}`} variant="body1" color="text.secondary" lineHeight={1.8}>
        {paragraph.join(' ')}
      </Typography>,
    );
  }

  return blocks;
}

const articleBody = {
  'best-ai-tools-to-try-in-2026': {
    excerpt: 'A practical look at the AI tools making the biggest impact in everyday work and creative workflows.',
    paragraphs: [
      'The most helpful AI tools do not just automate a single task. They save time, make decisions easier and improve the quality of work across several stages of a workflow.',
      'When choosing a tool, the best question is not “What is the most advanced model?” but “Which one solves a real bottleneck for my work?” For creators, that might be idea generation or editing. For students, it might be research summaries or note organization. For business users, it might be meeting support, content drafting and task automation.',
      'The best stack often blends a general assistant with one or two specialized tools. Microsoft and Google are increasingly integrated across workspaces, while independent tools remain strong in design, video and specialized research tasks.',
    ],
    faqs: [
      { question: 'Should I try more than one AI tool?', answer: 'Yes. Many people use a general assistant plus one specialized tool depending on the task.' },
      { question: 'How do I keep AI output useful?', answer: 'Start with clear prompts, verify facts and review outputs before publishing or shipping work.' },
    ],
    sources: ['Gartner AI adoption reports', 'Industry tool documentation', 'Author review of workflow patterns'],
  },
};

export default function ArticlePage() {
  const { slug } = useParams();
  const article = publishedArticles.find((item) => item.slug === slug);
  if (!article) {
    return <NotFoundPage />;
  }
  const content = article.content ? null : articleBody[slug] || articleBody['best-ai-tools-to-try-in-2026'];

  return (
    <>
      <SEO title={article.seoTitle || `${article.title} | ToolPilot AI`} description={article.metaDescription || article.excerpt} canonical={`/articles/${article.slug}`} />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs aria-label="Breadcrumb" sx={{ mb: 2 }}>
        <Link to="/">Home</Link>
        <Link to="/ai-tools">AI Tools</Link>
        <Typography color="text.primary">{article.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Stack spacing={2}>
            <Chip label={article.category} color="primary" sx={{ alignSelf: 'flex-start' }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2.5rem', md: '4rem' } }}>{article.title}</Typography>
            <Typography variant="h6" color="text.secondary">{article.excerpt}</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main' }}>{article.author.slice(0, 1)}</Avatar>
              <Box>
                <Typography fontWeight={700}>{article.author}</Typography>
                <Typography variant="body2" color="text.secondary">{article.date} · {article.readTime}</Typography>
              </Box>
            </Stack>
          </Stack>

          <Box component="img" src={article.image} alt={article.title} sx={{ width: '100%', borderRadius: 4, mt: 4, height: 420, objectFit: 'cover' }} />

          {!article.content && (
            <Paper elevation={0} sx={{ p: 3, my: 4, backgroundColor: 'rgba(91,76,245,0.04)', borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700}>Table of contents</Typography>
              <List dense>
                <ListItem disablePadding><ListItemText primary="Why the right AI tool matters" /></ListItem>
                <ListItem disablePadding><ListItemText primary="How to pick the best option" /></ListItem>
                <ListItem disablePadding><ListItemText primary="Smart workflows for real use" /></ListItem>
              </List>
            </Paper>
          )}

          <Stack spacing={3} sx={{ mt: 3 }}>
            {article.content
              ? renderMarkdown(article.content)
              : content.paragraphs.map((paragraph) => (
              <Typography key={paragraph} variant="body1" color="text.secondary" lineHeight={1.8}>{paragraph}</Typography>
              ))}
          </Stack>

          <Paper elevation={0} sx={{ p: 3, my: 4, borderLeft: '4px solid', borderColor: 'primary.main', backgroundColor: 'background.paper', borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700}>Important note</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              AI can improve speed and output, but strong results still depend on responsible review, clear prompt design and fact-checking when facts matter.
            </Typography>
          </Paper>

          {content && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h4" fontWeight={800}>Frequently asked questions</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {content.faqs.map((faq) => (
                  <Paper key={faq.question} elevation={0} sx={{ p: 2, borderRadius: 3 }}>
                    <Typography fontWeight={700}>{faq.question}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>{faq.answer}</Typography>
                  </Paper>
                ))}
              </Stack>

              <Divider sx={{ my: 4 }} />
              <Typography variant="h5" fontWeight={800}>Sources</Typography>
              <List>
                {content.sources.map((source) => (
                  <ListItem key={source} disablePadding>
                    <ListItemText primary={source} />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          <Divider sx={{ my: 4 }} />

          <Typography variant="h4" fontWeight={800}>Related articles</Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {publishedArticles.filter((item) => item.slug !== article.slug).slice(0, 3).map((item) => (
              <Grid item xs={12} md={4} key={item.slug}>
                <ArticleCard article={item} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ my: 5 }}>
            <Newsletter />
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box sx={{ position: { lg: 'sticky' }, top: 90 }}>
            {!article.content && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={800}>Table of contents</Typography>
                <List dense>
                  <ListItem disablePadding><ListItemText primary="Why AI tools matter" /></ListItem>
                  <ListItem disablePadding><ListItemText primary="Choosing the right one" /></ListItem>
                  <ListItem disablePadding><ListItemText primary="Smart workflows" /></ListItem>
                  <ListItem disablePadding><ListItemText primary="FAQ" /></ListItem>
                </List>
              </Paper>
            )}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={800}>Popular articles</Typography>
              <List>
                {publishedArticles.slice(0, 3).map((item) => (
                  <ListItem key={item.slug} disablePadding sx={{ py: 1 }}>
                    <ListItemText primary={item.title} secondary={item.readTime} />
                  </ListItem>
                ))}
              </List>
            </Paper>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={800}>Relevant tools</Typography>
              <List>
                {['ChatGPT', 'Gemini', 'Midjourney'].map((tool) => (
                  <ListItem key={tool} disablePadding sx={{ py: 1 }}>
                    <ListItemText primary={tool} secondary="AI workflow tool" />
                  </ListItem>
                ))}
              </List>
            </Paper>
            <AdSlot label="Sidebar ad" height={220} />
          </Box>
        </Grid>
      </Grid>
    </Container>
    </>
  );
}

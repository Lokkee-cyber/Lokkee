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
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { publishedArticles } from '../data/articles';
import ArticleCard from '../components/ArticleCard';
import Newsletter from '../components/Newsletter';
import SEO from '../components/SEO';
import NotFoundPage from './NotFoundPage';
import { getLegacyArticleContent } from '../data/legacyArticleContent';
import ComparisonTable from '../components/ComparisonTable';
import AdSlot from '../components/AdSlot';

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

const INLINE_ADS = ['inline', 'square', 'inline'];

function withInlineAds(blocks, slug) {
  const total = blocks.length;
  if (total < 3) return blocks;
  const adCount = total >= 9 ? 3 : total >= 6 ? 2 : 1;
  const targets = Array.from({ length: adCount }, (_, i) => Math.round((total * (i + 1)) / (adCount + 1)));
  const positions = new Set();
  targets.forEach((target) => {
    let position = Math.min(Math.max(target, 1), total - 1);
    while (position < total - 1 && ['h4', 'h5'].includes(blocks[position - 1]?.props?.variant)) position += 1;
    if (position < total) positions.add(position);
  });
  const result = [];
  let adIndex = 0;
  blocks.forEach((block, index) => {
    if (positions.has(index)) {
      result.push(<AdSlot key={`inline-ad-${slug}-${index}`} name={INLINE_ADS[adIndex % INLINE_ADS.length]} sx={{ my: 1 }} />);
      adIndex += 1;
    }
    result.push(block);
  });
  return result;
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = publishedArticles.find((item) => item.slug === slug);
  if (!article) {
    return <NotFoundPage />;
  }
  const content = article.content ? null : getLegacyArticleContent(slug);

  return (
    <>
      <SEO title={article.seoTitle || `${article.title} | LokkeeVerse`} description={article.metaDescription || article.excerpt} canonical={`/articles/${article.slug}`} />
      <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
      <Breadcrumbs aria-label="Breadcrumb" sx={{ mb: 2 }}>
        <Link to="/">Home</Link>
        <Link to="/ai-tools">AI Tools</Link>
        <Typography color="text.primary">{article.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={{ xs: 3, lg: 4 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={2}>
            <Chip label={article.category} color="primary" sx={{ alignSelf: 'flex-start' }} />
            <Typography variant="h2" sx={{ maxWidth: 900, fontSize: 'clamp(2rem, 5vw, 3.75rem)', lineHeight: 1.05, overflowWrap: 'anywhere' }}>{article.title}</Typography>
            
            <Typography variant="h6" color="text.secondary">{article.excerpt}</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main' }}>{article.author.slice(0, 1)}</Avatar>
              <Box>
                <Typography fontWeight={700}>{article.author}</Typography>
                <Typography variant="body2" color="text.secondary">{article.date} · {article.readTime}</Typography>
              </Box>
            </Stack>
          </Stack>

          {article.image && (
            <Box component="img" src={article.image} alt={article.title} sx={{ width: '100%', borderRadius: 4, mt: 4, height: { xs: 240, md: 420 }, objectFit: 'cover' }} />
          )}

          {/* Leaderboard ad under the article header */}
          <AdSlot variant="leaderboard" sx={{ mt: 4 }} />

          {article.comparison && (
            <Box sx={{ my: 4 }}>
              <ComparisonTable comparison={article.comparison} />
            </Box>
          )}
           
          {!article.content && (
            <Paper elevation={0} sx={{ p: 3, my: 4, backgroundColor: '#5b4cf50a', borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700}>Table of contents</Typography>
              <List dense>
                <ListItem disablePadding><ListItemText primary="Why the right AI tool matters" /></ListItem>
                <ListItem disablePadding><ListItemText primary="How to pick the best option" /></ListItem>
                <ListItem disablePadding><ListItemText primary="Smart workflows for real use" /></ListItem>
              </List>
            </Paper>
            
          )}
          
          <Stack spacing={3} sx={{ mt: 3, maxWidth: 800, '& .MuiTypography-root': { overflowWrap: 'anywhere' } }}>
            {article.content
              ? withInlineAds(renderMarkdown(article.content), article.slug)
              : withInlineAds(content.paragraphs.map((paragraph) => (
              <Typography key={paragraph} variant="body1" color="text.secondary" lineHeight={1.8}>{paragraph}</Typography>
              )), article.slug)}
          </Stack>
          {!article.automation?.generated && (
            <Paper elevation={0} sx={{ p: 3, my: 4, borderLeft: '4px solid', borderColor: 'primary.main', backgroundColor: 'background.paper', borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700}>Important note</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                AI can improve speed and output, but strong results still depend on responsible review, clear prompt design and fact-checking when facts matter.
              </Typography>
            </Paper>
          )}
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

          <Divider sx={{ my: 4 }} />

          <AdSlot key={`native-${article.slug}`} name="native" sx={{ mb: 4 }} />

          {/* Square ad above related articles */}
          <AdSlot variant="square" sx={{ mb: 4 }} />

          <Typography variant="h4" fontWeight={800}>Related articles</Typography>
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 1 }}>
            {publishedArticles.filter((item) => item.slug !== article.slug).slice(0, 3).map((item) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.slug}>
                <ArticleCard article={item} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ my: 5 }}>
            <Newsletter />
          </Box>

          {/* Bottom banner before the sidebar fold */}
          <AdSlot variant="leaderboard" sx={{ mt: 2, mb: 4 }} />
        </Grid>
           
        <Grid size={{ xs: 12, lg: 4 }}>
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
              <Typography variant="h6" fontWeight={800}>Latest articles</Typography>
              <List>
                {publishedArticles.filter((item) => item.slug !== article.slug).slice(0, 5).map((item) => (
                  <ListItemButton
                    key={item.slug}
                    component={Link}
                    to={`/articles/${item.slug}`}
                    sx={{ px: 0, py: 1, borderRadius: 1 }}
                  >
                    <ListItemText primary={item.title} secondary={item.readTime} />
                  </ListItemButton>
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
          </Box>
        </Grid>
      </Grid>
    </Container>
    </>
  );
}

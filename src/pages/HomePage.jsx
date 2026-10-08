import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import {
  AutoAwesome,
  BusinessCenterRounded,
  CodeRounded,
  CompareArrowsRounded,
  EditNoteRounded,
  EmojiPeopleRounded,
  GraphicEqRounded,
  ImageRounded,
  SchoolRounded,
  VideoCameraBackRounded,
} from '@mui/icons-material';
import { articlePreviews, categories, tools } from '../data/siteData.js';
import SEO from '../components/SEO.jsx';
import ToolCard from '../components/ToolCard.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import Newsletter from '../components/Newsletter.jsx';
import SearchBar from '../components/SearchBar.jsx';

const categoryIcons = {
  'AI Tools': AutoAwesome,
  'AI Video': VideoCameraBackRounded,
  'AI Image': ImageRounded,
  'AI Writing': EditNoteRounded,
  'AI Voice & Audio': GraphicEqRounded,
  'AI Coding': CodeRounded,
  'AI for Creators': EmojiPeopleRounded,
  'AI for Business': BusinessCenterRounded,
  'AI for Students': SchoolRounded,
  'AI Comparisons': CompareArrowsRounded,
};

export default function HomePage() {
  const [page, setPage] = useState(1);
  const perPage = 4;
  const latestArticles = articlePreviews.slice(0, 8);
  const pageArticles = latestArticles.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <SEO title="ToolPilot AI | Discover the right AI tools" description="Discover, compare and learn how to use AI tools and software that help you create, work and grow faster." canonical="/" />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, background: 'linear-gradient(135deg, rgba(91,76,245,0.10), rgba(19,184,166,0.08))', borderRadius: 1, mb: 6 }}>
        <Grid container alignItems="center" spacing={4}>
          <Grid item xs={12} md={7} >
            <Chip label="AI discovery platform" color="primary" sx={{ mb: 2, fontWeight: 700, }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2.6rem', md: '4.3rem' }, lineHeight: 1.02 }}>
              Find the Best AI Tools for Your Work and Creativity
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ my: 3, maxWidth: 660 }}>
              Discover, compare and learn how to use the AI tools that help you create, work and grow faster.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component={Link} to="/ai-tools" variant="contained" size="large">
                Explore AI Tools
              </Button>
              <Button component={Link} to="/search" variant="outlined" size="large">
                Search the directory
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                height: { xs: 260, md: 420 },
                borderRadius: 2,
                background: 'radial-gradient(circle at top, rgba(91,76,245,0.28), rgba(19,184,166,0.10) 40%, transparent), linear-gradient(135deg, #111827 0%, #1e293b 100%)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(91, 76, 245, 0.2)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 24,
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: '10%',
                  top: '20%',
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #5b4cf5, #9a8cff)',
                  opacity: 0.9,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  right: '12%',
                  bottom: '18%',
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #13b8a6, #7ef2db)',
                  opacity: 0.8,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 6, border: 1, borderColor: 'divider' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={800} mb={0.5}>Find the right tool faster</Typography>
            <Typography variant="body2" color="text.secondary">Search tools, articles and categories by name or workflow.</Typography>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: 460 } }}>
            <SearchBar compact />
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ py: 8 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={800}>Featured tools</Typography>
          <Button component={Link} to="/ai-tools" variant="text">View all tools</Button>
        </Stack>
        <Grid container spacing={3}>
          {tools.slice(0, 3).map((tool) => (
            <Grid item xs={12} md={4} key={tool.slug}>
              <ToolCard tool={tool} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ py: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={800}>Browse categories</Typography>
          <Button component={Link} to="/comparisons" variant="text">See comparisons</Button>
        </Stack>
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.slug}>
              <CategoryCard category={category} icon={categoryIcons[category.title] || AutoAwesome} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>Popular guides</Typography>
        <Grid container spacing={3}>
          {articlePreviews.slice(0, 3).map((article) => (
            <Grid item xs={12} md={4} key={article.slug}>
              <ArticleCard article={article} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ py: 2 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>Latest articles</Typography>
        <Grid container spacing={3}>
          {pageArticles.map((article) => (
            <Grid item xs={12} sm={6} lg={3} key={article.slug}>
              <ArticleCard article={article} />
            </Grid>
          ))}
        </Grid>
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination count={Math.ceil(latestArticles.length / perPage)} page={page - 1} onChange={(event, value) => setPage(value)} color="primary" />
        </Stack>
      </Box>

      <Box sx={{ py: 8 }}>
        <Newsletter />
      </Box>
    </Container>
    </>
  );
}

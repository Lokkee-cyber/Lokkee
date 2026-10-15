import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
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
import { categories, tools } from '../data/siteData.js';
import { publishedArticles } from '../data/articles.js';
import SEO from '../components/SEO.jsx';
import ToolCard from '../components/ToolCard.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import Newsletter from '../components/Newsletter.jsx';
import SearchBar from '../components/SearchBar.jsx';
import AdCashBanner from '../components/AdCashBanner.jsx';

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
  const latestArticles = publishedArticles.slice(0, 6);

  return (
    <>
      <SEO title="LokkeeVerse | Discover useful AI tools and smarter workflows" description="Discover, compare, and learn how to use AI tools and software that help you create, work, and grow smarter." canonical="/" />
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            mb: { xs: 5, md: 7 },
            borderRadius: { xs: 3, md: 5 },
            overflow: 'hidden',
            border: 1,
            borderColor: 'divider',
            background: 'linear-gradient(125deg, rgba(91,76,245,0.12), rgba(19,184,166,0.08) 70%, rgba(255,255,255,0.9))',
          }}
        >
          <Grid container alignItems="center" spacing={{ xs: 3, md: 5 }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="overline" color="primary.main" fontWeight={800} letterSpacing="0.12em">
                AI tools, explained clearly
              </Typography>
              <Typography variant="h1" sx={{ mt: 1, maxWidth: 760, fontSize: { xs: '2.4rem', sm: '3.35rem', md: '4rem' }, lineHeight: 1.04 }}>
                Find the right AI tools for the work you do.
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2.5, mb: 3, maxWidth: 650, fontWeight: 400, lineHeight: 1.6 }}>
                Clear guides, useful comparisons, and practical workflows to help you choose and use AI with confidence.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button component={Link} to="/articles" variant="contained" size="large" disableElevation>
                  Explore all articles
                </Button>
                <Button component={Link} to="/ai-tools" variant="outlined" size="large">
                  Browse AI tools
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  minHeight: { xs: 190, md: 230 },
                  p: { xs: 2.5, md: 3.5 },
                  borderRadius: 3,
                  color: '#fff',
                  background: 'linear-gradient(145deg, #28216f 0%, #5145d8 58%, #117f83 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.76)', fontWeight: 800, letterSpacing: '0.12em' }}>
                    Explore with purpose
                  </Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ mt: 1, maxWidth: 360 }}>
                    Practical knowledge for better AI decisions.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 3 }}>
                  {[`${publishedArticles.length} guides`, `${categories.length} topics`, `${tools.length} tools`].map((label) => (
                    <Box key={label} sx={{ px: 1.5, py: 0.75, borderRadius: 99, border: '1px solid rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.1)', fontSize: 13, fontWeight: 700 }}>
                      {label}
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        <Box component="section" aria-labelledby="latest-articles-heading" sx={{ mb: { xs: 5, md: 6 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'flex-end' }} spacing={1.5} sx={{ mb: 3 }}>
            <Box>
              <Typography variant="overline" color="primary.main" fontWeight={800} letterSpacing="0.1em">Fresh from the editorial desk</Typography>
              <Typography id="latest-articles-heading" variant="h3" fontWeight={800}>Latest articles</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>Newly published guides, with the newest stories first.</Typography>
            </Box>
            <Button component={Link} to="/articles" variant="outlined" sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
              View all {publishedArticles.length} articles
            </Button>
          </Stack>
          <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
            {latestArticles.map((article) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={article.slug}>
                <ArticleCard article={article} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <AdCashBanner zoneId="12304726" />

        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, mb: { xs: 5, md: 6 }, border: 1, borderColor: 'divider', borderRadius: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} spacing={2}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={800}>Find the right tool faster</Typography>
              <Typography variant="body2" color="text.secondary">Search tools, articles, and topics by name or workflow.</Typography>
            </Box>
            <Box sx={{ width: { xs: '100%', md: 460 } }}><SearchBar compact /></Box>
          </Stack>
        </Paper>

        <Box component="section" sx={{ mb: { xs: 5, md: 6 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
            <Box>
              <Typography variant="overline" color="primary.main" fontWeight={800}>Make a confident choice</Typography>
              <Typography variant="h3" fontWeight={800}>Useful AI tools</Typography>
            </Box>
            <Button component={Link} to="/ai-tools" variant="text">Browse all tools</Button>
          </Stack>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {tools.slice(0, 3).map((tool) => (
              <Grid size={{ xs: 12, md: 4 }} key={tool.slug}><ToolCard tool={tool} /></Grid>
            ))}
          </Grid>
        </Box>

        <Box component="section" sx={{ mb: { xs: 5, md: 6 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
            <Box>
              <Typography variant="overline" color="primary.main" fontWeight={800}>Browse by workflow</Typography>
              <Typography variant="h3" fontWeight={800}>Explore topics</Typography>
            </Box>
            <Button component={Link} to="/comparisons" variant="text">See comparisons</Button>
          </Stack>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {categories.map((category) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={category.slug}>
                <CategoryCard category={category} icon={categoryIcons[category.title] || AutoAwesome} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ py: { xs: 3, md: 5 } }}><Newsletter /></Box>
      </Container>
    </>
  );
}

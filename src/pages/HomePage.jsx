import { Box, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AutoAwesomeRounded, MenuBookRounded, NewspaperRounded } from '@mui/icons-material';

import SEO from '../components/SEO.jsx';
import Shelf from '../components/Shelf.jsx';
import NewsSlideshow from '../components/NewsSlideshow.jsx';
import TileCard from '../components/TileCard.jsx';
import CategoryTileCard from '../components/CategoryTileCard.jsx';
import NovelUpdateCard from '../components/NovelUpdateCard.jsx';
import { publishedArticles } from '../data/articles.js';
import { isAiArticle, isNewsArticle } from '../data/contentCategories.js';
import { fictionGenres } from '../data/fictionGenres.js';
import { fictionSeries, episodesForSeries } from '../data/fiction.js';

const aiCategoryShelf = [
  { title: 'AI Writing', description: 'Draft, edit and research faster with AI.', path: '/ai-writing' },
  { title: 'AI Video', description: 'Create and edit video with generative tools.', path: '/ai-video' },
  { title: 'AI Tools', description: 'Verified tools for everyday work.', path: '/ai-tools' },
  { title: 'AI Image', description: 'Generate and edit images with AI.', path: '/ai-image' },
  { title: 'AI Voice & Audio', description: 'Voiceovers, podcasts and audio clean-up.', path: '/ai-audio' },
  { title: 'AI Coding', description: 'Copilots and helpers for developers.', path: '/ai-coding' },
  { title: 'AI for Creators', description: 'Workflows for YouTube, socials and beyond.', path: '/ai-creators' },
  { title: 'AI for Business', description: 'Automation, marketing and operations.', path: '/ai-business' },
  { title: 'AI for Students', description: 'Study, research and note-taking help.', path: '/ai-students' },
];

const aiTileImages = {
  'AI Writing': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
  'AI Video': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
  'AI Tools': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80',
  'AI Image': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  'AI Voice & Audio': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
  'AI Coding': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
  'AI for Creators': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  'AI for Business': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
  'AI for Students': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
};

/*
 * Builds the "New & Updated Novels" list, excluding demo series.
 * Series with the most episodes (i.e. the most new content) come first,
 * followed by the rest in release order. Returns items shaped as
 * { series, badge, isNewRelease, updatedAt }.
 */
function buildNovelUpdates() {
  const updates = fictionSeries
    .filter((series) => !series.demo)
    .map((series) => {
      const episodes = episodesForSeries(series.slug);
      const latestDate = episodes
        .map((episode) => Date.parse(episode.updatedAt || episode.publishedAt || episode.date || '') || 0)
        .sort((a, b) => b - a)[0] || 0;
      return { series, episodes, latestDate };
    });

  /*
   * Rank by recency when any episode dates exist; otherwise by episode
   * count so the shelf still shows the most content-rich series first.
   */
  const anyDates = updates.some((item) => item.latestDate > 0);
  const ranked = [...updates].sort((a, b) => {
    if (anyDates) {
      if (b.latestDate !== a.latestDate) return b.latestDate - a.latestDate;
    }
    if (b.episodes.length !== a.episodes.length) return b.episodes.length - a.episodes.length;
    return a.series.title.localeCompare(b.series.title);
  });

  return ranked.slice(0, 10).map((item) => {
    const isNewRelease = item.episodes.length <= 1;
    const badge = isNewRelease ? 'NEW' : `+${item.episodes.length - 1} EP`;
    return { series: item.series, badge, isNewRelease, updatedAt: item.latestDate };
  });
}

export default function HomePage() {
  const news = publishedArticles.filter(isNewsArticle).slice(0, 10);
  const ai = publishedArticles.filter(isAiArticle).slice(0, 10);
  const genres = fictionGenres.slice(0, 8);
  const novelUpdates = buildNovelUpdates();

  return (
    <>
      <SEO
        title="LokkeeVerse | Serial Fiction, News & AI"
        description="Discover original serial fiction, catch up on the latest news, and explore practical AI tools, guides and comparisons."
        canonical="/"
      />

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        {/* 1. News Feed — modern slide show */}
        <NewsSlideshow articles={news} />

        {/* 2. Serial Fiction — borderless on the page body */}
        <Shelf
          heading="Serial Fiction"
          subtitle="Browse by genre — ongoing stories you can discover, follow and keep reading."
          action={{ label: 'Explore all', to: '/fiction' }}
          contained
          borderless
          ariaLabel="Serial Fiction"
          cardBasis={{ xs: '96%', sm: '46%', xmd: '34%', md: '27%', lg: '21%', xl: '16%' }}
          emptyMessage="New stories are on their way. Check back soon."
        >
          {genres.map((genre) => (
            <CategoryTileCard
              key={genre.slug}
              title={genre.label}
              description={genre.description}
              image={genre.image}
              to={`/fiction?genre=${genre.slug}`}
            />
          ))}
        </Shelf>

        {/* 3. AI Content */}
        <Shelf
          heading="AI Content"
          subtitle="Practical AI tools, guides, prompts and comparisons to help you work smarter."
          action={{ label: 'Discover', to: '/ai-content' }}
          ariaLabel="AI Content"
          cardBasis={{ xs: '64%', sm: '38%', xmd: '30%', md: '24%', lg: '19%', xl: '15%' }}
          emptyMessage="Explore our AI categories and guides as new content is published."
        >
          {aiCategoryShelf.map((category) => (
            <CategoryTileCard
              key={category.path}
              title={category.title}
              description={category.description}
              image={aiTileImages[category.title]}
              to={category.path}
            />
          ))}
          {ai.map((article) => (
            <TileCard key={article.slug} article={article} />
          ))}
        </Shelf>

        {/* 4. New & Updated Novels — large borderless cards on the page body */}
        <Shelf
          heading="New & Updated Novels"
          subtitle="Series with fresh episodes and newly released stories."
          action={{ label: 'All series', to: '/fiction' }}
          ariaLabel="New and Updated Novels"
          cardBasis={{ xs: '72%', sm: '38%', xmd: '30%', md: '24%', lg: '19%', xl: '15%' }}
          emptyMessage="No series published yet. Check back soon."
        >
          {novelUpdates.map(({ series, badge }) => (
            <NovelUpdateCard key={series.slug} series={series} badge={badge} />
          ))}
        </Shelf>

        {/* Secondary discovery links */}
        <Box
          sx={{
            mt: { xs: 2, md: 4 },
            p: { xs: 2.5, md: 4 },
            border: 1,
            borderColor: 'divider',
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight={900}>
                Explore your way
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                Choose a section and find something worth your time.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ width: { xs: '100%', md: 'auto' } }}>
              <Box
                component={Link}
                to="/fiction"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.25,
                  py: 1.25,
                  borderRadius: 2.5,
                  fontWeight: 800,
                  color: 'fiction.accent',
                  border: '1px solid rgba(199,167,255,0.35)',
                  textDecoration: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <MenuBookRounded fontSize="small" />
                Read stories
              </Box>

              <Box
                component={Link}
                to="/news"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.25,
                  py: 1.25,
                  borderRadius: 2.5,
                  fontWeight: 800,
                  color: 'text.primary',
                  border: '1px solid',
                  borderColor: 'divider',
                  textDecoration: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <NewspaperRounded fontSize="small" />
                Read news
              </Box>

              <Box
                component={Link}
                to="/ai-tools"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.25,
                  py: 1.25,
                  borderRadius: 2.5,
                  fontWeight: 800,
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: 'divider',
                  textDecoration: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <AutoAwesomeRounded fontSize="small" />
                Explore AI
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </>
  );
}

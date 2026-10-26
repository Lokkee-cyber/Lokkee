import { Box, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AutoAwesomeRounded, MenuBookRounded, NewspaperRounded } from '@mui/icons-material';

import SEO from '../components/SEO.jsx';
import Shelf from '../components/Shelf.jsx';
import TileCard from '../components/TileCard.jsx';
import CategoryTileCard from '../components/CategoryTileCard.jsx';
import { publishedArticles } from '../data/articles.js';
import { isAiArticle, isNewsArticle } from '../data/contentCategories.js';
import { fictionGenres } from '../data/fictionGenres.js';

const newsCategoryShelf = [
  { title: 'Nigeria News', description: 'Stories from across Nigeria.', path: '/news?category=Nigeria%20News' },
  { title: 'World News', description: 'Reporting and events from around the world.', path: '/news?category=World%20News' },
  { title: 'Trending', description: "What readers are catching up on right now.", path: '/news' },
];

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

const newsTileImages = {
  'Nigeria News': 'https://images.unsplash.com/photo-1618828665347-d870c38c95c7?auto=format&fit=crop&w=800&q=80',
  'World News': 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80',
  Trending: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
};

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

export default function HomePage() {
  const news = publishedArticles.filter(isNewsArticle).slice(0, 10);
  const ai = publishedArticles.filter(isAiArticle).slice(0, 10);
  const genres = fictionGenres.slice(0, 8);

  return (
    <>
      <SEO
        title="ToolPillot | Serial Fiction, News & AI"
        description="Discover original serial fiction, catch up on the latest news, and explore practical AI tools, guides and comparisons."
        canonical="/"
      />

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        {/* 1. Serial Fiction — first, visually distinct */}
        <Shelf
          heading="Serial Fiction"
          subtitle="Browse by genre — ongoing stories you can discover, follow and keep reading."
          action={{ label: 'Explore all', to: '/fiction' }}
          contained
          ariaLabel="Serial Fiction"
          cardBasis={{ xs: '46%', sm: '31%', xmd: '23%', md: '18%', lg: '15%', xl: '12%' }}
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

        {/* 2. News Feed */}
        <Shelf
          heading="News Feed"
          subtitle="Reporting, culture and current affairs, newest first."
          action={{ label: 'Latest', to: '/news' }}
          ariaLabel="News Feed"
          cardBasis={{ xs: '31%', sm: '23%', xmd: '18%', md: '15%', lg: '13%', xl: '10.5%' }}
          emptyMessage="No published news stories yet."
        >
          {newsCategoryShelf.map((category) => (
            <CategoryTileCard
              key={category.path}
              title={category.title}
              description={category.description}
              image={newsTileImages[category.title]}
              to={category.path}
            />
          ))}
          {news.map((article) => (
            <TileCard key={article.slug} article={article} />
          ))}
        </Shelf>

        {/* 3. AI Content */}
        <Shelf
          heading="AI Content"
          subtitle="Practical AI tools, guides, prompts and comparisons to help you work smarter."
          action={{ label: 'Discover', to: '/ai-content' }}
          ariaLabel="AI Content"
          cardBasis={{ xs: '31%', sm: '23%', xmd: '18%', md: '15%', lg: '13%', xl: '10.5%' }}
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

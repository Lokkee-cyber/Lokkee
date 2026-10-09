import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { comparisons } from '../data/siteData';
import { publishedArticles } from '../data/articles';
import SEO from '../components/SEO';

export default function ComparisonIndexPage() {
  const comparisonArticles = publishedArticles.filter((article) => article.comparison);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <SEO
        title="AI Tool Comparisons | ToolPilot AI"
        description="Compare AI tools side by side to find the right fit for your workflow."
        canonical="/comparisons"
      />
      <Typography variant="overline" color="primary.main" fontWeight={700}>Compare tools</Typography>
      <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' } }}>
        AI Comparisons
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 760, mb: 4 }}>
        Side-by-side comparisons of features, plans, and practical differences.
      </Typography>
      <Stack spacing={2}>
        {comparisons.map((comparison) => (
          <Paper key={comparison.slug} sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 2, sm: 3 } }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
              <Box>
                <Typography variant="h5" fontWeight={800}>{comparison.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>{comparison.summary}</Typography>
              </Box>
              <Button component={Link} to={`/compare/${comparison.slug}`} variant="contained" sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}>
                View comparison
              </Button>
            </Stack>
          </Paper>
        ))}
        {comparisonArticles.map((article) => (
          <Paper key={article.slug} sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 2, sm: 3 } }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
              <Box>
                <Typography variant="h5" fontWeight={800}>{article.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>{article.excerpt}</Typography>
              </Box>
              <Button component={Link} to={`/articles/${article.slug}`} variant="contained" sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}>
                View comparison
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
      {!comparisons.length && !comparisonArticles.length && (
        <Typography color="text.secondary">No comparisons have been published yet.</Typography>
      )}
    </Container>
  );
}

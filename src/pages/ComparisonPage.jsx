import { useParams } from 'react-router-dom';
import { Box, Container, Grid, Typography } from '@mui/material';
import { comparisons } from '../data/siteData';
import ComparisonTable from '../components/ComparisonTable';
import SEO from '../components/SEO';
import NotFoundPage from './NotFoundPage';
import AdCashBanner from "../components/AdCashBanner";

export default function ComparisonPage() {
  const { slug } = useParams();
  const comparison = comparisons.find((item) => item.slug === slug);
  if (!comparison) return <NotFoundPage />;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      
      <SEO title={`${comparison.title} | LokkeeVerse`} description={comparison.summary} canonical={`/compare/${comparison.slug}`} />
      <Typography variant="overline" color="primary.main" fontWeight={700}>AI Comparison</Typography>
      <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' } }}>{comparison.title}</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>{comparison.summary}</Typography>
       <AdCashBanner zoneId="12307066" />
      <Box sx={{ my: 4 }}>
        <ComparisonTable comparison={comparison} />
      </Box>
            <AdCashBanner zoneId="12304726" />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ p: 3, borderRadius: 4, backgroundColor: 'rgba(91,76,245,0.07)' }}>
            <Typography variant="h5" fontWeight={800}>Winner</Typography>
            <Typography sx={{ mt: 1 }}>{comparison.left}</Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ p: 3, borderRadius: 4, backgroundColor: 'rgba(19,184,166,0.08)' }}>
            <Typography variant="h5" fontWeight={800}>Verdict</Typography>
            <Typography sx={{ mt: 1 }}>{comparison.verdict}</Typography>
          </Box>
        </Grid>
      </Grid>
      <AdCashBanner zoneId="12304726" />
    </Container>
  );
}

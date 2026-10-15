import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { siteConfig } from '../config/siteConfig';
import NotFoundPage from './NotFoundPage';
import AdCashBanner from "../components/AdCashBanner";

export default function AuthorPage() {
  const { slug } = useParams();
  const isEditorial = slug === siteConfig.author.slug;
  if (!isEditorial) return <NotFoundPage />;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <SEO title="LokkeeVerse Editorial — Authors" description="Learn about the LokkeeVerse editorial approach to research, verification, and publishing." canonical={`/authors/${slug}`} />
      <Typography variant="h1" fontWeight={800}>LokkeeVerse Editorial</Typography>
      <Typography color="text.secondary" sx={{ display: 'block', mt: 2, maxWidth: 780 }}>
        {siteConfig.author.bio}
      </Typography>
      <AdCashBanner zoneId="12304726" />
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mt: 4, borderRadius: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h2" fontWeight={800}>Areas of focus</Typography>
            <Typography color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {siteConfig.author.areas.join(', ')}.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h2" fontWeight={800}>Editorial approach</Typography>
            <Typography color="text.secondary">
              LokkeeVerse Editorial is the publishing identity used for site guides and tool coverage. Articles are intended to answer a defined reader question, explain the scope of the guidance, and make relevant trade-offs visible. Product information is checked against public documentation where available, but providers can change features, prices, and access without notice.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h2" fontWeight={800}>Verification and limitations</Typography>
            <Typography color="text.secondary">
              Summaries and recommendations should not be read as a guarantee of product performance or a claim that every feature has been personally tested. Readers should confirm important details with the provider and use human review for factual, financial, legal, medical, or other consequential decisions.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h2" fontWeight={800}>Corrections and updates</Typography>
            <Typography color="text.secondary">
              We welcome specific, source-supported correction requests through the contact page. When a published guide is revised, its displayed update information helps readers identify that the page has changed; it does not imply that every provider detail is continuously monitored.
            </Typography>
          </Box>
          <Typography color="text.secondary">
            This profile represents the site’s editorial publishing identity. It does not claim individual credentials, personal testing outcomes, or a team history that has not been published.
          </Typography>
        </Stack>
         <AdCashBanner zoneId="12304726" />
      </Paper>
    </Container>
  );
}

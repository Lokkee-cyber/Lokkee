import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { siteConfig } from '../config/siteConfig';

export default function AuthorPage() {
  const { slug } = useParams();
  const isEditorial = slug === siteConfig.author.slug;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <SEO title="ToolPilot AI Editorial — Authors" description="Learn about the ToolPilot AI editorial team and its approach to research and publishing." canonical={`/authors/${slug}`} />
      <Typography variant="h1" fontWeight={800}>ToolPilot AI Editorial</Typography>
      <Typography color="text.secondary" sx={{ display: 'block', mt: 2, maxWidth: 780 }}>
        {siteConfig.author.bio}
      </Typography>
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
              All ToolPilot AI articles are developed with a clear scope, source-aware claims, practical examples and explicit limitations. Product details can change, so published guidance is reviewed and updated when the underlying information changes.
            </Typography>
          </Box>
          {isEditorial && (
            <Typography color="text.secondary">
              This profile represents the site’s editorial publishing identity. It does not claim individual credentials, personal testing outcomes or a specific team history that has not been published.
            </Typography>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

import { Container, Grid, Paper, Typography } from '@mui/material';
import SEO from '../components/SEO';

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <SEO title="About | ToolPilot AI" description="Learn about the mission of ToolPilot AI and why we help readers discover useful AI tools and software." canonical="/about" />
      <Typography variant="h2" fontWeight={800}>About ToolPilot AI</Typography>
      <Paper elevation={0} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary">
              ToolPilot AI exists to help people discover practical AI tools, understand how they work and make better decisions about the software they use. We focus on quality, clarity and independent editorial judgment.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={700}>Our mission</Typography>
            <Typography color="text.secondary">We help people compare AI products and learn real-world ways to use them to create, work and grow.</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={700}>Our approach</Typography>
            <Typography color="text.secondary">We prioritize transparent explanations, honest pros and cons, and original guidance that adds value beyond a generic product list.</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

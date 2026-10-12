import { Container, Grid, Paper, Typography } from '@mui/material';
import SEO from '../components/SEO';

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <SEO title="About | LokkeeVerse" description="Learn about the mission of LokkeeVerse and why we help people evaluate useful AI tools and workflows." canonical="/about" />
      <Typography variant="h2" fontWeight={800}>About LokkeeVerse</Typography>
      <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 820 }}>
        LokkeeVerse is an independent discovery and learning resource for people evaluating AI software. The site brings tool profiles, practical guides, and comparisons together so readers can move from a question to a more informed shortlist.
      </Typography>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mt: 4, borderRadius: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={700}>Our mission</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              We help people understand where AI tools may fit into real work, study, and creative projects. The goal is not to recommend a product for everyone. It is to explain the choices clearly enough that readers can judge what fits their needs, skills, budget, and existing workflow.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight={700}>What you’ll find</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              The directory covers general assistants and specialist tools for writing, research, coding, image creation, video, audio, and productivity. Guides focus on a particular task or audience; comparisons bring practical differences into one place. Tool pages summarize use cases, features, pricing information, benefits, and limitations.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight={700}>How we approach research</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              We aim to use clear scopes, source-aware claims, and current public product information. Pricing, availability, and capabilities can change, so readers should check a provider’s own site before making a purchase or relying on a feature. We distinguish practical guidance from facts that need direct verification.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight={700}>Editorial independence</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Our goal is to explain trade-offs rather than repeat product marketing. Where a page discusses a product, it should include relevant limitations as well as potential uses. A listing is not a guarantee that a tool is suitable for every reader or every high-stakes task.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight={700}>What this site is not</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              LokkeeVerse is an editorial resource, not an AI vendor, software support desk, financial adviser, or substitute for professional judgment. We do not promise particular business, academic, or income results from using any product. Review the provider’s terms and independently verify important outputs.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

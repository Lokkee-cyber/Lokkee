import { Container, Paper, Typography } from '@mui/material';
import SEO from '../components/SEO';

const contentMap = {
  privacy: {
    title: 'Privacy Policy',
    text: 'We collect only what is needed to operate the website. This can include analytics data, contact form submissions and limited technical logs. We do not sell personal data. We use trusted service providers only where required for website operation or security.',
  },
  terms: {
    title: 'Terms',
    text: 'ToolPilot AI provides information for educational and informational purposes. Visitors are responsible for verifying information before using tools in a professional or business context.',
  },
  disclaimer: {
    title: 'Disclaimer',
    text: 'AI tools evolve quickly. Information on this site may change over time. We aim to keep content accurate, but tool pricing, features and availability can change without notice.',
  },
  affiliate: {
    title: 'Affiliate Disclosure',
    text: 'Some links on this website may be affiliate links. If a visitor clicks and makes a purchase, we may receive a commission at no additional cost to the visitor. We clearly disclose affiliate relationships when applicable.',
  },
  editorial: {
    title: 'Editorial Policy',
    text: 'Our content is researched, compared and written by editorial contributors. We review information for accuracy, disclose limitations, and update articles when product details or workflows change.',
  },
};

export default function LegalPage({ type = 'privacy' }) {
  const content = contentMap[type] || contentMap.privacy;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <SEO title={`${content.title} | ToolPilot AI`} description={content.text} canonical={`/${type === 'privacy' ? 'privacy-policy' : type === 'terms' ? 'terms' : type === 'disclaimer' ? 'disclaimer' : type === 'affiliate' ? 'affiliate-disclosure' : 'editorial-policy'}`} />
      <Typography variant="h2" fontWeight={800}>{content.title}</Typography>
      <Paper elevation={0} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
        <Typography variant="body1" color="text.secondary">{content.text}</Typography>
      </Paper>
    </Container>
  );
}

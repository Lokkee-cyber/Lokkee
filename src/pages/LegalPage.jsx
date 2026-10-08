import { Box, Container, Paper, Typography } from '@mui/material';
import SEO from '../components/SEO';

const legalContent = {
  privacy: {
    title: 'Privacy Policy',
    route: 'privacy-policy',
    description: 'Privacy practices for ToolPilot AI website visitors and newsletter subscribers.',
    sections: [
      ['Information we collect', 'We may collect basic technical information such as browser type, page views and approximate country, where privacy controls permit it. Contact and newsletter submissions contain the information you choose to provide. We do not request passwords or payment details.'],
      ['How information is used', 'Information is used to answer messages, deliver configured newsletter updates, improve site performance and understand which public pages are useful. Data is not sold.'],
      ['Third-party services', 'Analytics, advertising, email or contact providers are used only when configured and disclosed. Each provider should have its own privacy notice. No provider is activated without a documented configuration.'],
      ['Your choices', 'You may request access, correction or deletion of information you provided through a contact message. Contact us with the relevant details and we will respond according to applicable law.'],
      ['Policy updates', 'This policy may be updated when the site’s services, legal obligations or applicable regulations change. The latest version will always be published on this page.'],
    ],
  },
  terms: {
    title: 'Terms of Use',
    route: 'terms',
    description: 'Terms governing use of ToolPilot AI educational content and website.',
    sections: [
      ['Site purpose', 'ToolPilot AI provides editorial summaries and practical information about AI tools. It is not a vendor, warranty provider or professional advice service.'],
      ['Accuracy', 'We aim to keep content current, but product features, pricing, availability and legal terms can change. Verify details with the official provider before making purchases or relying on software.'],
      ['External links', 'Links to third-party services are provided for convenience. ToolPilot AI does not control their content, availability or privacy practices.'],
      ['Intellectual property', 'Original site content is protected by applicable law. Third-party trademarks and product names remain owned by their respective owners.'],
      ['Changes', 'These terms may be updated when necessary. Continued use after a change means you accept the updated terms.'],
    ],
  },
  disclaimer: {
    title: 'Editorial Disclaimer',
    route: 'disclaimer',
    description: 'Transparency notice for editorial content, product information and affiliate relationships.',
    sections: [
      ['General information', 'ToolPilot AI is an independent editorial resource. Its content is intended for educational and planning purposes, not professional advice.'],
      ['Product changes', 'Tool names, pricing, capabilities and terms can change without notice. Your final decision should be based on current official documentation and your own requirements.'],
      ['Testing and claims', 'ToolPilot AI does not claim personal testing outcomes unless a clearly documented testing process is published. Ratings, recommendations and summaries are based on available product information or information explicitly labeled as editorial.'],
      ['Affiliate relationships', 'Some links may be affiliate links. Any applicable commission is disclosed and does not change the price paid by the reader.'],
    ],
  },
  affiliate: {
    title: 'Affiliate Disclosure',
    route: 'affiliate-disclosure',
    description: 'Information about affiliate links and editorial independence.',
    sections: [
      ['What this page covers', 'This page explains how ToolPilot AI handles commercially linked products and services.'],
      ['Affiliate links', 'A link may earn a commission if you purchase or sign up through it. This can occur at no additional cost to you, and it does not influence the editorial selection shown on the site.'],
      ['Editorial independence', 'Editorial recommendations are based on usefulness, accessibility, documented features and limitations. Commercial relationships are disclosed when applicable.'],
      ['Questions', 'Contact ToolPilot AI through the contact page with any disclosure or correction request.'],
    ],
  },
  editorial: {
    title: 'Editorial Policy',
    route: 'editorial-policy',
    description: 'Editorial standards, research, corrections and AI-assisted publishing practices.',
    sections: [
      ['Editorial standards', 'We aim to make every article useful, accurate, source-aware and clearly scoped. We distinguish factual information, product summaries and recommendations.'],
      ['Research process', 'We identify the question, define the audience, compare relevant sources and document limitations. Product details are checked against official documentation when available.'],
      ['AI assistance', 'AI may be used to support research, outline and editing. ToolPilot AI does not present assistant output as automatically verified. Human editors are responsible for final review and publication decisions.'],
      ['Corrections', 'Errors are corrected promptly and the updated date is shown where relevant. A correction log can be requested through the contact page.'],
      ['Sponsored content', 'Sponsored or affiliate content is clearly labeled and never presented as independent editorial judgment.'],
    ],
  },
};

export default function LegalPage({ type = 'privacy' }) {
  const content = legalContent[type] || legalContent.privacy;
  const path = `/${content.route}`;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <SEO title={`${content.title} | ToolPilot AI`} description={content.description} canonical={path} />
      <Typography variant="h1" fontWeight={800} sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem', md: '6rem' } }}>{content.title}</Typography>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mt: 4, borderRadius: 4 }}>
        <Box component="article">
          {content.sections.map(([heading, body]) => (
            <Box key={heading} sx={{ mb: 4 }}>
              <Typography variant="h2" fontWeight={800} sx={{ fontSize: '1.3rem', mb: 1 }}>{heading}</Typography>
              <Typography color="text.secondary">{body}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
}

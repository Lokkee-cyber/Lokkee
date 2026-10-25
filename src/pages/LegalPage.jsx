import { Box, Container, Paper, Typography } from '@mui/material';
import SEO from '../components/SEO';

const legalContent = {
  privacy: {
    title: 'Privacy Policy',
    route: 'privacy-policy',
    description: 'Privacy practices for LokkeeVerse website visitors and newsletter subscribers.',
    sections: [
      ['Information we collect', 'The information involved depends on the features you use. If you submit a contact or newsletter form, you provide the details entered in that form. The site may also process basic technical information, such as browser and device data or page requests, as needed to deliver and protect the service. Do not submit passwords, payment details, or sensitive personal information through editorial forms.'],
      ['How information is used', 'Information may be used to respond to a message, deliver a requested update when a newsletter provider is configured, maintain site security, and understand site usage where analytics are enabled. We use information for the purpose connected to the feature through which it was provided and do not represent that every feature is active in every deployment.'],
      ['Cookies, analytics, and advertising', 'Configured analytics or advertising services may use cookies or similar technologies to measure visits, manage preferences, or deliver ads. Availability depends on the site configuration and the relevant provider. Your browser settings and any consent controls presented by a provider can affect these technologies; disabling them may change how that provider works.'],
      ['Third-party advertising', 'LokkeeVerse displays banner ads, native sponsored ads, and a floating social bar served by a third-party advertising network. These providers may collect data directly from your browser under their own privacy policies. Ads are labeled “Advertisement” or “Sponsored.” Pop-under ads are not enabled by this site.'],
            ['Service providers and external sites', 'A configured email, analytics, advertising, hosting, or contact provider may process information on the site’s behalf or under its own terms. Those providers publish separate privacy notices that explain their practices. Links to other websites take you outside LokkeeVerse, and their operators control what they collect there.'],
      ['Retention and security', 'Information is kept only as long as it is reasonably needed for the purpose for which it was collected, to maintain required records, or to resolve a request. Reasonable safeguards are used where information is handled, but no internet transmission or storage system can be guaranteed completely secure.'],
      ['Your choices and requests', 'Depending on your location and applicable law, you may have rights to access, correct, delete, or restrict certain personal information. You may also be able to unsubscribe from a configured newsletter using its message controls. Contact us with enough context to identify your request, but do not include credentials or unnecessary sensitive data.'],
      ['Policy updates', 'This notice may change as site features, providers, or legal requirements change. The version published here describes the current stated practices; review it again when you use a feature after a material update.'],
    ],
  },
  terms: {
    title: 'Terms of Use',
    route: 'terms',
    description: 'Terms governing use of LokkeeVerse educational content and website.',
    sections: [
      ['Using the site', 'These terms apply when you access LokkeeVerse and its public editorial material. Use the site lawfully and do not interfere with its operation, attempt unauthorized access, or misuse forms and links. Additional terms from an external provider may apply when you leave this site or use that provider’s product.'],
      ['Editorial information, not professional advice', 'Guides, comparisons, and tool summaries are general information to support your own research. They are not legal, financial, medical, employment, security, or other professional advice. You are responsible for deciding whether a product and its terms are appropriate for your circumstances.'],
      ['Accuracy and changing products', 'We make a reasonable effort to present information clearly, but AI products change frequently. Features, prices, plans, model access, eligibility, and terms may differ by region or change after publication. Confirm current details with the provider before purchasing, implementing, or relying on a product.'],
      ['Third-party products and links', 'A directory entry or link is not a warranty, endorsement of every provider claim, or promise of availability. Third-party providers control their products, support, data practices, and service terms. Review their current documentation and policies before sharing information or creating an account.'],
      ['Content and intellectual property', 'Unless a page states otherwise, original LokkeeVerse text and site materials belong to their respective rights holders and may not be republished as your own. Product names, logos, and trademarks belong to their owners and are used to identify products. Nothing on this site transfers ownership of third-party material.'],
      ['No guaranteed outcomes', 'Examples and recommendations are informational, not promises that a tool will produce a particular result. You remain responsible for checking generated output, complying with applicable laws and provider terms, and making decisions based on your own review.'],
      ['Changes to these terms', 'We may revise these terms when the site or applicable requirements change. The current text is published on this page. If you do not agree with an updated version, stop using the site.'],
    ],
  },
  disclaimer: {
    title: 'Editorial Disclaimer',
    route: 'disclaimer',
    description: 'Transparency notice for editorial content, product information and affiliate relationships.',
    sections: [
      ['General information', 'LokkeeVerse publishes educational and planning information about AI products and workflows. It is not professional advice and should not replace qualified guidance tailored to your situation. You are responsible for evaluating whether a product, output, or workflow is suitable for your needs.'],
      ['Product changes and availability', 'Product names, capabilities, prices, plan limits, regional availability, and provider terms may change without notice. Information on a page may not reflect a change made after its latest review. Consult the official provider documentation for current details before making a decision.'],
      ['Testing, ratings, and recommendations', 'A product summary or recommendation does not by itself claim that every feature was personally tested. Where a page describes a specific evaluation method or test, that method should be stated on the page. Editorial opinions are not guarantees of performance, accuracy, safety, or suitability.'],
      ['AI-generated output and important decisions', 'AI systems can produce incomplete, outdated, or incorrect output. Check sources and use qualified human review for consequential work, including legal, medical, financial, educational, hiring, and security decisions. Do not treat a generated answer as verified merely because it sounds confident.'],
      ['Income and performance claims', 'Guides discussing business ideas, productivity gains, or income examples are informational. Figures are not typical-result claims or guarantees, and actual outcomes depend on many factors such as skill, demand, costs, effort, and market conditions.'],
      ['Affiliate relationships', 'Some pages or links may involve a commercial or affiliate relationship, where applicable. Any such relationship should be disclosed clearly. A link is provided for reader convenience and does not guarantee that a provider is the best option for every use case.'],
    ],
  },
  affiliate: {
    title: 'Affiliate Disclosure',
    route: 'affiliate-disclosure',
    description: 'Information about affiliate links and editorial independence.',
    sections: [
      ['What this disclosure means', 'This page explains the kinds of commercial relationships that may apply to links or recommendations on LokkeeVerse. Not every link is an affiliate link, and a product appearing in the directory does not by itself mean that LokkeeVerse receives compensation from its provider.'],
      ['Affiliate links and commissions', 'If a link is an affiliate link, LokkeeVerse may receive a commission when a reader makes a qualifying purchase or signup through it. Where offered, the commission is generally paid by the provider and does not add a separate charge to the reader, though the provider’s own pricing and terms always control.'],
      ['How to evaluate a recommendation', 'A commercial link is not a guarantee of product quality, availability, or suitability. Compare the provider’s current plans, feature limits, cancellation terms, and privacy information before deciding. We aim to describe useful trade-offs so readers can make an independent choice.'],
      ['Editorial independence and labeling', 'Commercial relationships should be identified where they apply and should not be presented as proof that a product is objectively best. Recommendations are editorial material; readers should consider the stated use case, limitations, and their own requirements rather than relying on a commission relationship.'],
      ['Questions and corrections', 'If a link or disclosure appears unclear, send us the page URL and the relevant text through the contact page. Contact-form delivery depends on the site’s configured provider, as explained on that page.'],
    ],
  },
  editorial: {
    title: 'Editorial Policy',
    route: 'editorial-policy',
    description: 'Editorial standards, research, corrections and AI-assisted publishing practices.',
    sections: [
      ['Editorial standards', 'We aim to publish useful, clearly scoped, and source-aware material. A guide should identify its subject and intended reader, distinguish product descriptions from editorial judgment, and describe meaningful limitations where relevant. We avoid presenting promotional language as independently verified fact.'],
      ['Research and product information', 'Research begins with the question a page is meant to answer. We consult public materials, including official product documentation where available, and compare details relevant to the stated use case. Features, prices, and access can change; readers should check providers directly for current terms.'],
      ['Recommendations and comparisons', 'Recommendations are contextual, not universal rankings. A comparison should explain the dimensions being discussed and avoid implying that one tool is suitable for every person or task. Inclusion in a guide is not a guarantee, endorsement of every provider claim, or evidence of personal testing unless the page says how it was tested.'],
      ['Use of AI in editorial work', 'AI tools may assist with brainstorming, outlining, research support, or editing. Their output is not treated as automatically accurate or publication-ready. Human editorial review remains responsible for scope, verification, clarity, and the decision to publish.'],
      ['Corrections and updates', 'We welcome specific correction requests supported by a relevant source. Send the page URL, the disputed detail, and supporting information through the contact page. When material changes are made, update information may be shown on the page; an update date does not mean every detail is continuously monitored.'],
      ['Commercial content and disclosures', 'Where sponsored material or affiliate relationships apply, they should be identified so readers can assess the context. Commercial links do not remove the need to explain a product’s limitations, and editorial descriptions should not be mistaken for provider guarantees.'],
      ['Scope and accountability', 'LokkeeVerse content is general editorial information, not professional advice. Readers should independently verify claims that affect important decisions and review the provider’s current terms. We may revise this policy as publishing practices evolve.'],
    ],
  },
};

export default function LegalPage({ type = 'privacy' }) {
  const content = legalContent[type] || legalContent.privacy;
  const path = `/${content.route}`;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <SEO title={`${content.title} | LokkeeVerse`} description={content.description} canonical={path} />
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

import { useParams } from 'react-router-dom';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { tools, articlePreviews } from '../data/siteData.js';
import ToolReview from '../components/ToolReview.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import SEO from '../components/SEO.jsx';

export default function ToolPage() {
  const { slug } = useParams();
  const tool = tools.find((item) => item.slug === slug) || tools[0];

  return (
    <>
      <SEO title={`${tool.name} overview | ToolPilot AI`} description={tool.description} canonical={`/tools/${tool.slug}`} />
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Paper elevation={0} sx={{ p: { xs: 2.25, sm: 3, md: 5 }, borderRadius: 4 }}>
        <ToolReview tool={tool} />
      </Paper>

      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: { xs: 2, md: 4 } }}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' } }}
          >
            Related articles
          </Typography>
        </Grid>
        {articlePreviews.slice(0, 3).map((article) => (
          <Grid item xs={12} md={4} key={article.slug}>
            <ArticleCard article={article} />
          </Grid>
        ))}
      </Grid>
    </Container>
    </>
  );
}

import { useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SEO from '../components/SEO';

export default function AdminPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (values) => {
    console.log('Article saved', values);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
      <SEO title="Admin Dashboard | ToolPilot AI" description="Secure dashboard for managing articles, tools and SEO settings." canonical="/admin" />
      <Typography variant="h2" fontWeight={800}>Admin dashboard</Typography>
      <Alert severity="info" sx={{ my: 3 }}>Protected admin routes require authentication in production deployments.</Alert>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {['Overview', 'Articles', 'Tools', 'Categories', 'SEO', 'Users'].map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700}>{section}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>Create article</Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Title" {...register('title', { required: true })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Slug" {...register('slug', { required: true })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Excerpt" multiline minRows={2} {...register('excerpt', { required: true })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Content" multiline minRows={8} {...register('content', { required: true })} />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Button type="submit" variant="contained">Publish article</Button>
                  <Button variant="outlined">Save draft</Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

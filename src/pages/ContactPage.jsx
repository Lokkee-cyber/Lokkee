import { useForm } from 'react-hook-form';
import { Box, Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
import SEO from '../components/SEO';

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (values) => {
    console.log('Contact form', values);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <SEO title="Contact | ToolPilot AI" description="Contact ToolPilot AI about editorial questions, partnerships or feedback." canonical="/contact" />
      <Typography variant="h2" fontWeight={800}>Contact</Typography>
      <Paper elevation={0} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Name" {...register('name', { required: 'Name is required' })} error={Boolean(errors.name)} helperText={errors.name?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" type="email" {...register('email', { required: 'Email is required' })} error={Boolean(errors.email)} helperText={errors.email?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Message" multiline minRows={5} {...register('message', { required: 'Message is required' })} error={Boolean(errors.message)} helperText={errors.message?.message} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">Send message</Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

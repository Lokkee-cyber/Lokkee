import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
import SEO from '../components/SEO';
import FormStatus from '../components/FormStatus';
import { siteConfig } from '../config/siteConfig';

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const onSubmit = async (values) => {
    setSending(true);
    setStatus('');
    try {
      if (!siteConfig.contactEndpoint) {
        throw new Error('Contact delivery is not configured.');
      }
      const response = await fetch(siteConfig.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('The message could not be sent.');
      reset();
      setStatus({ type: 'success', message: 'Your message was received. Thank you for contacting LokkeeVerse.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'We could not send your message. Please try again later.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <SEO title="Contact LokkeeVerse | Editorial Questions & Feedback" description="Contact LokkeeVerse about editorial questions, feedback, corrections, or partnership inquiries." canonical="/contact" />
      <Typography variant="h1" fontWeight={800} sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem', md: '6rem' } }}>Contact</Typography>
      <Typography color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Use this page for editorial questions, correction requests, feedback about a tool listing, or partnership inquiries. Helpful messages identify the relevant article or product and explain what should be reviewed. Please do not send passwords, private account details, financial information, or other sensitive data.
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={700}>Corrections and product updates</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            If you spot an outdated price, changed feature, broken link, or factual error, include the page URL and the specific passage or detail. Links to current official documentation help us assess a proposed correction. A message is a request for review, not an automatic change to the page.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={700}>Contact form delivery</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            The form can deliver a message only when a contact provider is configured for the site. If delivery is unavailable, the page will show a notice and your message will not be submitted. Do not use the form for urgent support with a third-party product; contact that provider directly.
          </Typography>
        </Grid>
      </Grid>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mt: 4, borderRadius: 4 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Name" autoComplete="name" {...register('name', { required: 'Name is required', maxLength: 100 })} error={Boolean(errors.name)} helperText={errors.name?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" type="email" autoComplete="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' } })} error={Boolean(errors.email)} helperText={errors.email?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Subject" {...register('subject', { required: 'Subject is required', maxLength: 150 })} error={Boolean(errors.subject)} helperText={errors.subject?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Message" multiline minRows={6} {...register('message', { required: 'Message is required', minLength: 10, maxLength: 5000 })} error={Boolean(errors.message)} helperText={errors.message?.message} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</Button>
            </Grid>
          </Grid>
          {status && <FormStatus status={status.type} message={status.message} />}
          {!siteConfig.contactEndpoint && <FormStatus status="error" message="Contact delivery is not configured. The form is ready for a secure backend or email-provider endpoint." />}
        </Box>
      </Paper>
    </Container>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import FormStatus from './FormStatus';
import { siteConfig } from '../config/siteConfig';

export default function Newsletter() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  const onSubmit = async (values) => {
    setSending(true);
    setStatus('');
    try {
      if (!siteConfig.newsletterEndpoint) {
        throw new Error('Newsletter delivery is not configured.');
      }
      const response = await fetch(siteConfig.newsletterEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });
      if (!response.ok) throw new Error('We could not complete your subscription.');
      reset();
      setStatus({ type: 'success', message: 'You are subscribed. Watch your inbox for the next ToolPilot AI briefing.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Subscription unavailable. Please try again later.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ background: 'linear-gradient(135deg, rgba(91,76,245,0.12), rgba(19,184,166,0.08))', p: { xs: 3, md: 5 }, borderRadius: 4 }}>
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Typography variant="h3" fontWeight={800}>Get practical AI tool guides</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
          A concise weekly briefing with useful AI tool comparisons, workflow ideas and product updates.
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', maxWidth: 560 }} noValidate>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField fullWidth label="Email address" type="email" autoComplete="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' } })} error={Boolean(errors.email)} helperText={errors.email?.message} />
            <Button type="submit" variant="contained" size="large" disabled={sending} sx={{ minWidth: 170 }}>{sending ? 'Subscribing…' : 'Subscribe'}</Button>
          </Stack>
          {status && <FormStatus status={status.type} message={status.message} />}
          {!siteConfig.newsletterEndpoint && <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>Newsletter delivery is ready for a configured provider. No subscription data is stored by ToolPilot AI yet.</Alert>}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            By subscribing, you agree to receive editorial updates. Unsubscribe at any time.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

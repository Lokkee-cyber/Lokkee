import { useForm } from 'react-hook-form';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';

export default function Newsletter() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (values) => {
    console.log('Newsletter signup', values);
  };

  return (
    <Paper elevation={0} sx={{ background: 'linear-gradient(135deg, rgba(91,76,245,0.12), rgba(19,184,166,0.08))', p: { xs: 3, md: 5 }, borderRadius: 4 }}>
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Typography variant="h3" fontWeight={800}>Stay Ahead of AI</Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={640}>
          Get useful AI tools, tutorials and practical guides delivered to your inbox.
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', maxWidth: 560 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Email address"
              type="email"
              {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Please enter a valid email' } })}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <Button type="submit" variant="contained" size="large" sx={{ minWidth: 170 }}>
              Subscribe
            </Button>
          </Stack>
          <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>
            No extra personal data required. Just your email.
          </Alert>
        </Box>
      </Stack>
    </Paper>
  );
}

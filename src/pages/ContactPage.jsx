
import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';

import SEO from '../components/SEO';
import { siteConfig } from '../config/siteConfig';

export default function ContactPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!emailPattern.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const subject = form.subject.trim() || 'LokkeeVerse Enquiry';

    const body = [
      `Name: ${form.name}`,
      `Reply email: ${form.email}`,
      '',
      'Message:',
      form.message,
    ].join('\n');

    const mailtoLink =
      `mailto:${siteConfig.contactEmail}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  return (
    <>
      <SEO
        title="Contact LokkeeVerse"
        description="Contact LokkeeVerse with questions, feedback, corrections, or suggestions."
      />

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Box textAlign="center" mb={5}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={800}
            gutterBottom
            sx={{ fontSize: { xs: '2rem', md: '2.7rem' } }}
          >
            Contact LokkeeVerse
          </Typography>

          <Typography color="text.secondary" sx={{ maxWidth: 520, mx: 'auto' }}>
            Have a question, correction, or suggestion? Choose how you would
            like to reach us.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3,
            maxWidth: 720,
            mx: 'auto',
          }}
        >
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              transition: '0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-3px)',
                boxShadow: 3,
              },
            }}
          >
            <CardActionArea
              onClick={() => {
                setError('');
                setOpen(true);
              }}
              sx={{ height: '100%' }}
            >
              <CardContent sx={{ textAlign: 'center', py: 5, px: 3 }}>
                <ContactSupportOutlinedIcon
                  sx={{ fontSize: 42, color: 'primary.main', mb: 2 }}
                />

                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Contact Form
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Send us a message
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              transition: '0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-3px)',
                boxShadow: 3,
              },
            }}
          >
            <CardActionArea
              component="a"
              href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
                'LokkeeVerse Enquiry'
              )}`}
              sx={{ height: '100%' }}
            >
              <CardContent sx={{ textAlign: 'center', py: 5, px: 3 }}>
                <MailOutlineOutlinedIcon
                  sx={{ fontSize: 42, color: 'primary.main', mb: 2 }}
                />

                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Email Us
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ overflowWrap: 'anywhere' }}
                >
                  {siteConfig.contactEmail}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 4 }}
        >
          We welcome your questions, feedback, and suggestions.
        </Typography>
      </Container>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="contact-dialog-title"
      >
        <DialogTitle
          id="contact-dialog-title"
          sx={{ pr: 7, fontWeight: 700 }}
        >
          Send us a message

          <IconButton
            aria-label="Close contact form"
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 12, top: 12 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              <Typography variant="body2" color="text.secondary">
                Complete the fields below. Your email app will open with your
                message ready to send.
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Your name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
                autoComplete="name"
              />

              <TextField
                label="Your email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                autoComplete="email"
              />

              <TextField
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                fullWidth
                placeholder="What is your message about?"
              />

              <TextField
                label="Your message"
                name="message"
                value={form.message}
                onChange={handleChange}
                fullWidth
                required
                multiline
                minRows={4}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpen(false)} color="inherit">
              Cancel
            </Button>

            <Button type="submit" variant="contained">
              Open Email to Send
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

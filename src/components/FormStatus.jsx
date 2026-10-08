import { Alert, Box } from '@mui/material';

export default function FormStatus({ status, message }) {
  if (!status) return null;
  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity={status === 'success' ? 'success' : 'error'} variant="outlined" role="status">
        {message}
      </Alert>
    </Box>
  );
}

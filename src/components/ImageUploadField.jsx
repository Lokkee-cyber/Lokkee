import { useRef, useState } from 'react';
import { Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';

const apiPath = '/__local-content';
const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Uploads an image to the repository (public/images) through the local admin
 * API and writes the returned site-relative path into the bound text field.
 */
export default function ImageUploadField({ label, value, onChange, helperText }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const upload = async (file) => {
    if (!file) return;
    setUploadError('');

    if (!file.type.startsWith('image/')) {
      setUploadError('Choose an image file (png, jpg, webp, gif, avif).');
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError('Image is larger than 8 MB. Compress it and try again.');
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Could not read the file.'));
        reader.readAsDataURL(file);
      });

      const response = await fetch(`${apiPath}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, data: dataUrl }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Upload failed.');

      onChange({ target: { value: result.path } });
    } catch (uploadFailure) {
      setUploadError(uploadFailure.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack spacing={1}>
      <TextField
        fullWidth
        label={label}
        value={value}
        onChange={onChange}
        helperText={uploadError || helperText || 'Paste a URL or upload a file — uploads are saved into public/images and committed with the site.'}
        error={Boolean(uploadError)}
      />
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          variant="outlined"
          size="small"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? 'Uploading…' : 'Upload image'}
        </Button>
        {uploading && <CircularProgress size={18} />}
        {value && (
          <Box
            component="img"
            src={value}
            alt="Preview"
            sx={{ height: 40, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', maxWidth: 160, objectFit: 'cover' }}
          />
        )}
      </Stack>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        hidden
        onChange={(event) => {
          upload(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      {uploadError === '' && !uploading && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'none' }} />
      )}
    </Stack>
  );
}

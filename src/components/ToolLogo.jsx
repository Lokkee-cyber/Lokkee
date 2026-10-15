import { Avatar } from '@mui/material';

export default function ToolLogo({ tool, size = 42 }) {
  let logoUrl;

  try {
    const domain = new URL(tool.website).hostname;
    logoUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  } catch {
    logoUrl = undefined;
  }

  return (
    <Avatar
      src={logoUrl}
      alt={`${tool.name} logo`}
      variant="rounded"
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        bgcolor: '#fff',
        border: '1px solid',
        borderColor: 'divider',
        '& img': { objectFit: 'contain', p: size > 48 ? 1 : 0.5 },
      }}
    >
      {tool.name.slice(0, 1)}
    </Avatar>
  );
}
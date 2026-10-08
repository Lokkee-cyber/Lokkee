import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';

export default function CategoryCard({ category, icon: Icon }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Chip
            icon={<Icon />} 
            label={category.title}
            color="primary"
            sx={{ fontWeight: 700, borderRadius: 2, px: 1, py: 2 }}
          />
        </Stack>
        <Typography variant="h6" fontWeight={700}>{category.title}</Typography>
        <Typography variant="body2" color="text.secondary">{category.description}</Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary">Browse guides</Typography>
          <Button component={Link} to={category.path} size="small" variant="text">
            Explore
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

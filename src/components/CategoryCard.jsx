import { Link } from 'react-router-dom';
import { ArrowForwardRounded } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';

export default function CategoryCard({ category, icon: Icon }) {
  return (
    <Card sx={{ height: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 3, transition: 'transform 180ms ease, box-shadow 180ms ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 18px 38px rgba(37, 50, 82, 0.14)' } }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.75, flex: 1, minWidth: 0, p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        <Box sx={{ width: 46, height: 46, borderRadius: 2.5, display: 'grid', placeItems: 'center', color: 'primary.main', bgcolor: 'action.hover', '& svg': { fontSize: 25 } }}>
          <Icon />
        </Box>
        <Typography variant="h6" fontWeight={800} sx={{ overflowWrap: 'anywhere' }}>{category.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ minHeight: '4.8em', lineHeight: 1.6, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden', overflowWrap: 'anywhere' }}>
          {category.description}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto', width: '100%' }}>
          <Typography variant="caption" color="text.secondary">Browse articles</Typography>
          <Button component={Link} to={category.path} size="small" variant="text" endIcon={<ArrowForwardRounded />}>
            Explore
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
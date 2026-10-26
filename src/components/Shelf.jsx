import { Box, Link, Stack, Typography } from '@mui/material';
import { ArrowForwardRounded } from '@mui/icons-material';

/**
 * Reusable horizontal content shelf.
 *
 * - heading: section title
 * - subtitle: optional muted description under the heading
 * - action: optional { label, to } rendered right-aligned
 * - children: horizontally scrolling cards (portrait or landscape)
 * - contained: wrap the shelf in a rounded surface container (used by fiction)
 * - cardBasis: responsive flex-basis for each card
 */
export default function Shelf({
  heading,
  subtitle,
  action,
  children,
  contained = false,
  ariaLabel,
  emptyMessage,
  containerSx,
  cardBasis = { xs: '44%', sm: '30%', md: '23%', lg: '19%' },
}) {
  return (
    <Box
      component="section"
      aria-label={ariaLabel || heading}
      sx={{
        mb: { xs: 4, md: 6 },
        minWidth: 0,
        overflowX: 'clip',
        ...(contained && {
          borderRadius: { xs: 3, md: 5 },
          bgcolor: 'fiction.surface',
          border: '1px solid rgba(199,167,255,0.14)',
          px: { xs: 1.75, sm: 2.5, md: 3.5 },
          py: { xs: 2.5, md: 3.5 },
        }),
        ...containerSx,
      }}
    >
      {(heading || action) && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
          sx={{ mb: subtitle ? 0.75 : 2.25 }}
        >
          <Typography
            component="h2"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.03em',
              fontSize: { xs: '1.45rem', sm: '1.8rem', md: '2.1rem' },
              color: contained ? '#FFFFFF' : 'text.primary',
              minWidth: 0,
            }}
          >
            {heading}
          </Typography>

          {action && (
            <Link
              href={action.to}
              underline="none"
              sx={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                fontWeight: 800,
                fontSize: { xs: '0.85rem', md: '0.95rem' },
                color: contained ? 'fiction.accent' : 'text.secondary',
                borderRadius: 2,
                px: 1.25,
                py: 0.75,
                transition: 'color 150ms ease, background-color 150ms ease',
                '&:hover': { color: contained ? '#E3D3FF' : 'primary.main', bgcolor: 'action.hover' },
                '&:focus-visible': { outline: '2px solid', outlineColor: 'fiction.accent', outlineOffset: 2 },
              }}
            >
              {action.label}
              <ArrowForwardRounded sx={{ fontSize: 18 }} />
            </Link>
          )}
        </Stack>
      )}

      {subtitle && (
        <Typography
          sx={{
            mb: 2.25,
            maxWidth: 720,
            color: contained ? 'rgba(213,197,245,0.78)' : 'text.secondary',
            fontSize: { xs: '0.9rem', md: '1rem' },
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>
      )}

      {children ? (
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1.25, md: 1.75 },
            overflowX: 'auto',
            overflowY: 'hidden',
            pb: 1.5,
            mb: -0.75,
            scrollSnapType: 'x proximity',
            scrollPaddingLeft: 2,
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(199,167,255,0.35) transparent',
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 10,
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(199,167,255,0.35)',
              borderRadius: 10,
              '&:hover': {
                background: 'rgba(199,167,255,0.55)',
              },
            },
            '& > *': {
              scrollSnapAlign: 'start',
              flex: `0 0 ${typeof cardBasis === 'string' ? cardBasis : cardBasis.xs}`,
              minWidth: 0,
            },
            '@media (min-width:600px)': {
              '& > *': { flexBasis: typeof cardBasis === 'string' ? cardBasis : cardBasis.sm },
            },
            '@media (min-width:760px)': {
              '& > *': { flexBasis: typeof cardBasis === 'string' ? cardBasis : (cardBasis.xmd || cardBasis.md) },
            },
            '@media (min-width:900px)': {
              '& > *': { flexBasis: typeof cardBasis === 'string' ? cardBasis : cardBasis.md },
            },
            '@media (min-width:1200px)': {
              '& > *': { flexBasis: typeof cardBasis === 'string' ? cardBasis : cardBasis.lg },
            },
            '@media (min-width:1536px)': {
              '& > *': { flexBasis: typeof cardBasis === 'string' ? cardBasis : (cardBasis.xl || cardBasis.lg) },
            },
          }}
        >
          {children}
        </Box>
      ) : (
        <Box
          sx={{
            py: 4,
            px: 2,
            border: '1px dashed',
            borderColor: contained ? 'rgba(199,167,255,0.3)' : 'divider',
            borderRadius: 3,
          }}
        >
          <Typography fontWeight={700}>{emptyMessage}</Typography>
        </Box>
      )}
    </Box>
  );
}

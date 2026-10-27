/**
 * Fiction genre taxonomy. Drives the homepage genre tiles and the
 * /fiction?genre= filter. Keep slugs URL-safe.
 */
export const fictionGenres = [
  { slug: 'smuts', label: 'Smuts', description: 'Steamy romance with grown-up heat.', image: 'https://images.pexels.com/photos/1700765/pexels-photo-1700765.jpeg' },
  { slug: 'action', label: 'Action', description: 'Fights, chases and close calls.', image: 'https://images.unsplash.com/photo-1575919220112-0d5a2dc6a4b6?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D' },
  { slug: 'romance', label: 'Romance', description: 'Slow burns and grand gestures.', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80' },
  { slug: 'fantasy', label: 'Fantasy', description: 'Magic systems and impossible worlds.', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
  { slug: 'mystery', label: 'Mystery', description: 'Cases, clues and cold trails.', image: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80' },
  { slug: 'contemporary', label: 'Contemporary', description: 'Real-world stories with real stakes.', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80' },
  { slug: 'horror', label: 'Horror', description: 'Dread, hauntings and slow burns.', image: 'https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D' },
  { slug: 'thriller', label: 'Thriller', description: 'Tension that never lets up.', image: 'https://images.unsplash.com/photo-1633266841047-719b5f737149?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D' },
];

export function genreLabelForSlug(slug) {
  return fictionGenres.find((genre) => genre.slug === slug)?.label || slug;
}

export function genreImageForSlug(slug) {
  return fictionGenres.find((genre) => genre.slug === slug)?.image;
}

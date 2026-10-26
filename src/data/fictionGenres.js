/**
 * Fiction genre taxonomy. Drives the homepage genre tiles and the
 * /fiction?genre= filter. Keep slugs URL-safe.
 */
export const fictionGenres = [
  { slug: 'smuts', label: 'Smuts', description: 'Steamy romance with grown-up heat.', image: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=800&q=80' },
  { slug: 'action', label: 'Action', description: 'Fights, chases and close calls.', image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80' },
  { slug: 'romance', label: 'Romance', description: 'Slow burns and grand gestures.', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80' },
  { slug: 'fantasy', label: 'Fantasy', description: 'Magic systems and impossible worlds.', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
  { slug: 'mystery', label: 'Mystery', description: 'Cases, clues and cold trails.', image: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80' },
  { slug: 'contemporary', label: 'Contemporary', description: 'Real-world stories with real stakes.', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80' },
  { slug: 'horror', label: 'Horror', description: 'Dread, hauntings and slow burns.', image: 'https://images.unsplash.com/photo-1713634439358-3032d550279b?auto=format&fit=crop&w=800&q=80' },
  { slug: 'thriller', label: 'Thriller', description: 'Tension that never lets up.', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80' },
];

export function genreLabelForSlug(slug) {
  return fictionGenres.find((genre) => genre.slug === slug)?.label || slug;
}

export function genreImageForSlug(slug) {
  return fictionGenres.find((genre) => genre.slug === slug)?.image;
}

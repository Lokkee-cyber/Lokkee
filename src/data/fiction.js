const seriesModules = import.meta.glob('../../content/fiction/series/*.json', { eager: true, import: 'default' });
const episodeModules = import.meta.glob('../../content/fiction/episodes/*.json', { eager: true, import: 'default' });

export const fictionSeries = Object.values(seriesModules)
  .filter((series) => series.status === 'published')
  .map((series) => ({ ...series, image: series.cover || series.image }));

export const fictionEpisodes = Object.values(episodeModules)
  .filter((episode) => episode.status === 'published')
  .sort((a, b) => a.number - b.number);

export const findSeries = (slug) => fictionSeries.find((series) => series.slug === slug);
export const episodesForSeries = (seriesSlug) => fictionEpisodes.filter((episode) => episode.seriesSlug === seriesSlug);
export const findEpisode = (seriesSlug, episodeSlug) => episodesForSeries(seriesSlug).find((episode) => episode.slug === episodeSlug);

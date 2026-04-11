export const formatSlugLabel = (slug = '') =>
  slug
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const normalizeCategory = (category = {}) => ({
  id: category.id ?? `category-${category.slug || 'unknown'}`,
  name: category.name || formatSlugLabel(category.slug),
  slug: category.slug || '',
  image: category.image || ''
});

export const normalizeCollection = (collection = {}) => ({
  id: collection.id ?? `collection-${collection.slug || 'unknown'}`,
  name: collection.name || formatSlugLabel(collection.slug),
  slug: collection.slug || '',
  description: collection.description || '',
  image: collection.image || '',
  hoverImage: collection.hover_image || collection.hoverImage || ''
});

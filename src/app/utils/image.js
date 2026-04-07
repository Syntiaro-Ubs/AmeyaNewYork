export const getImageUrl = (path) => {
  if (!path) return '';
  if (typeof path !== 'string') return path; 
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('/uploads/')) return `http://localhost:5000${path}`;
  // If it starts with /src/ or /assets/ it's likely a Vite-resolved static asset
  if (path.startsWith('/') || path.startsWith('src/')) return path; 
  return path;
};

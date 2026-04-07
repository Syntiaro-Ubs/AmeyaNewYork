/**
 * Safely parses a JSON string from the database.
 * If the input is already an object/array, it returns it.
 * If the input is a raw string (malformed JSON), it tries to return it as a single-item array.
 * @param {string|any} str 
 * @param {any} fallback 
 * @returns {any}
 */
export const safeJsonParse = (str, fallback = []) => {
  if (!str) return fallback;
  if (typeof str !== 'string') return str;
  
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('JSON Parse Error:', e, str);
    
    // If it's a simple string like "eclat-initial", wrap it in an array
    if (str && !str.startsWith('[') && !str.startsWith('{')) {
      return [str];
    }
    
    return fallback;
  }
};

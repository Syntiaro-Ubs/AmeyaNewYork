import { createContext, useContext, useEffect, useState } from 'react';
import { normalizeCategory, normalizeCollection } from '../utils/taxonomy';

const SiteDataContext = createContext(undefined);
const API_BASE = 'http://localhost:5000/api/homepage';

export function SiteDataProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSiteData = async () => {
    try {
      const [categoryResponse, collectionResponse] = await Promise.all([
        fetch(`${API_BASE}/categories/all`),
        fetch(`${API_BASE}/collections/all`)
      ]);

      const [categoryData, collectionData] = await Promise.all([
        categoryResponse.json(),
        collectionResponse.json()
      ]);

      setCategories((categoryData || []).map(normalizeCategory));
      setCollections((collectionData || []).map(normalizeCollection));
    } catch (error) {
      console.error('Failed to fetch site metadata:', error);
      setCategories([]);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteData();
  }, []);

  return (
    <SiteDataContext.Provider
      value={{
        categories,
        collections,
        loading,
        refreshSiteData: fetchSiteData
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);

  if (context === undefined) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }

  return context;
}

import { useState, useEffect } from 'react';
import { Hero } from '../components/home/Hero';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedCollections } from '../components/home/FeaturedCollections';
import { CollectionCards } from '../components/home/CollectionCards';
import { ProductSpotlight } from '../components/home/ProductSpotlight';
import { BrandStory } from '../components/home/BrandStory';
import { InstagramFeed } from '../components/home/InstagramFeed';

export function Home() {
  const [sections, setSections] = useState([]);
  const [dynamicBanner, setDynamicBanner] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/homepage');
        const data = await response.json();
        console.log('Homepage API response:', data);
        setSections(data);
      } catch (error) {
        console.error('Failed to fetch homepage sections:', error);
      }
    };

    const fetchBanner = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/banners/home');
        if (response.ok) {
          const data = await response.json();
          setDynamicBanner(data);
        }
      } catch (error) {
        console.error('Failed to fetch dynamic banner:', error);
      }
    };

    fetchSections();
    fetchBanner();
  }, []);

  const getSection = (slug) => {
    const section = sections.find(s => s.section_slug === slug);
    console.log(`Getting section "${slug}":`, section);
    if (slug === 'hero' && section && dynamicBanner) {
      return {
        ...section,
        media_url: dynamicBanner.media_url,
        media_type: dynamicBanner.media_type,
        focal_point: dynamicBanner.focal_point
      };
    }
    return section;
  };

  return (
    <>
      <Hero data={getSection('hero')} />
      <FeaturedCollections data={getSection('featured-collections')} />
      <CollectionCards data={getSection('collection-cards')} />
      <CategoryGrid data={getSection('category-grid')} />
      <ProductSpotlight data={getSection('product-spotlight')} />
      <BrandStory data={getSection('brand-story')} />
      <InstagramFeed data={getSection('instagram-feed')} />
    </>
  );
}

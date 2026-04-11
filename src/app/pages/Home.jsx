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
    fetchSections();
  }, []);

  const getSection = (slug) => {
    const section = sections.find(s => s.section_slug === slug);
    console.log(`Getting section "${slug}":`, section);
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

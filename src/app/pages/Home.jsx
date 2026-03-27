import { Hero } from '../components/home/Hero';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedCollections } from '../components/home/FeaturedCollections';
import { CollectionCards } from '../components/home/CollectionCards';
import { ProductSpotlight } from '../components/home/ProductSpotlight';
import { BrandStory } from '../components/home/BrandStory';
import { InstagramFeed } from '../components/home/InstagramFeed';
export function Home() {
  return <>
      <Hero />
      <FeaturedCollections />
      <CollectionCards />
      <CategoryGrid />
      <ProductSpotlight />
      <BrandStory />
      <InstagramFeed />
    </>;
}

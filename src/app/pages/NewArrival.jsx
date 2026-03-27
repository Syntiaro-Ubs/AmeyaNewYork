import { NewArrivalHero } from '../components/home/NewArrivalHero';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedCollections } from '../components/home/FeaturedCollections';
import { ProductSpotlight } from '../components/home/ProductSpotlight';

export function NewArrival() {
  return (
    <>
      <NewArrivalHero />
      <ProductSpotlight />
      <FeaturedCollections />
      <CategoryGrid />
    </>
  );
}

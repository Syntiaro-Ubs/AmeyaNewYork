/* ─────────────────────────────────────────────────────────────────────────────
   AMEYA New York — Product, Category & Collection Data
───────────────────────────────────────────────────────────────────────────── */

// ── Local Image Imports ──────────────────────────────────────────────────────
import eleveCollectionImg from '../assets/collection/ELEVE/2/RGM.JPG';
import eleveHoverImg from '../assets/collection/ELEVE/2/RG11.JPG';
import loveEngagementImg from '../assets/collection/Love and Engagement/D1M.JPG';
import loveEngagementHoverImg from '../assets/collection/Love and Engagement/D13.JPG';
import eclatInitialImg from '../assets/collection/ECLAT INITIAL/AM-P000444-A-ELE_3.JPG';

// Category Images
import ringsCategoryImg from '../assets/collection/Love and Engagement/D13.JPG';
import ringsCategoryHoverImg from '../assets/collection/Love and Engagement/D1M.JPG';
import earringsCategoryImg from '../assets/collection/ELEVE/4/ERR11.JPG';
import earringsCategoryHoverImg from '../assets/collection/ELEVE/4/ERG11.JPG';
import necklacesCategoryImg from '../assets/collection/ELEVE/4/PRG11.JPG';
import necklacesCategoryHoverImg from '../assets/collection/ELEVE/4/PRGM.JPG';
import braceletsCategoryImg from '../assets/collection/ELEVE/5/BRACELET/BD11.JPG';
import braceletsCategoryHoverImg from '../assets/collection/ELEVE/5/BRACELET/BDM.JPG';
import setsCategoryImg from '../assets/collection/ELEVE/5/PB1.JPG';
import setsCategoryHoverImg from '../assets/collection/ELEVE/5/PBM.JPG';
const IMG_PLAT_RING = ringsCategoryImg;
const IMG_RING_HANDS = ringsCategoryHoverImg;
const IMG_NECKLACE = necklacesCategoryImg;
const IMG_BRACELET = braceletsCategoryImg;
const IMG_EARRINGS_GOLD = eleveHoverImg;
const IMG_APEX = eleveCollectionImg;
const IMG_ELEVE = eleveCollectionImg;

// ── Types ────────────────────────────────────────────────────────────────────

// ── Products ─────────────────────────────────────────────────────────────────
export const products = [];



// ── Categories ───────────────────────────────────────────────────────────────
export const categories = [{
  id: "1",
  name: "Rings",
  slug: "rings",
  image: ringsCategoryImg,
  hoverImage: ringsCategoryHoverImg
}, {
  id: "2",
  name: "Earrings",
  slug: "earrings",
  image: earringsCategoryImg,
  hoverImage: earringsCategoryHoverImg
}, {
  id: "3",
  name: "Necklaces & Pendants",
  slug: "necklaces",
  image: necklacesCategoryImg,
  hoverImage: necklacesCategoryHoverImg
}, {
  id: "4",
  name: "Bracelets & Bangles",
  slug: "bracelets",
  image: braceletsCategoryImg,
  hoverImage: braceletsCategoryHoverImg
}, {
  id: "5",
  name: "Sets",
  slug: "sets",
  image: setsCategoryImg,
  hoverImage: setsCategoryHoverImg
}];

// ── Collections ──────────────────────────────────────────────────────────────
export const collections = [{
  id: "1",
  name: "Éclat Initial",
  slug: "eclat-initial",
  description: "Personal, powerful, and precious. Celebrate your identity with our signature initial collection.",
  image: eclatInitialImg,
  hoverImage: eclatInitialImg,
  textColor: "text-white"
}, {
  id: "2",
  name: "Elevé",
  slug: "eleve",
  description: "Elevated elegance for everyday moments. Refined silhouettes crafted with precision.",
  image: eleveCollectionImg,
  hoverImage: eleveHoverImg,
  textColor: "text-white"
}, {
  id: "3",
  name: "Love and Engagement",
  slug: "love-engagement",
  description: "For the moments that change everything. Exquisite diamonds for your forever.",
  image: loveEngagementImg,
  hoverImage: loveEngagementHoverImg,
  textColor: "text-white"
}, {
  id: "4",
  name: "Apex Spark",
  slug: "apex-spark",
  description: "Bold brilliance meets timeless design. Statement pieces that command attention.",
  image: IMG_APEX,
  hoverImage: IMG_PLAT_RING,
  textColor: "text-white"
}];

// ── Instagram Feed ───────────────────────────────────────────────────────────
export const instagramFeed = [{
  id: 1,
  image: IMG_ELEVE
}, {
  id: 2,
  image: IMG_RING_HANDS
}, {
  id: 3,
  image: IMG_APEX
}, {
  id: 4,
  image: IMG_NECKLACE
}, {
  id: 5,
  image: IMG_EARRINGS_GOLD
}, {
  id: 6,
  image: IMG_BRACELET
}];

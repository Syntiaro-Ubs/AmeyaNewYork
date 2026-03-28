/* ─────────────────────────────────────────────────────────────────────────────
   AMEYA New York — Product, Category & Collection Data
───────────────────────────────────────────────────────────────────────────── */

// ── Local Image Imports ──────────────────────────────────────────────────────
import eleveCollectionImg from '../assets/collection/ELEVE/2/RGM.JPG';
import eleveHoverImg from '../assets/collection/ELEVE/2/RG11.JPG';
import loveEngagementImg from '../assets/collection/Love and Engagement/D1M.JPG';
import loveEngagementHoverImg from '../assets/collection/Love and Engagement/D13.JPG';
import eclatInitialImg from '../assets/collection/ECLAT INITIAL/AM-P000444-A-ELE_3.JPG';

// Love & Engagement Rings
import db1Img from '../assets/collection/Love and Engagement/RING Blue/DB1.JPG';
import db1mImg from '../assets/collection/Love and Engagement/RING Blue/DB1M.JPG';
import dg13Img from '../assets/collection/Love and Engagement/ring Green/DG13.JPG';
import dg1mImg from '../assets/collection/Love and Engagement/ring Green/DG1M.JPG';
import dr1Img from '../assets/collection/Love and Engagement/ring red/DR1.JPG';
import dr1mImg from '../assets/collection/Love and Engagement/ring red/DR1M.JPG';
import d13Img from '../assets/collection/Love and Engagement/D13.JPG';
import d1mImg from '../assets/collection/Love and Engagement/D1M.JPG';

// Elevé Rings
import rb11Img from '../assets/collection/ELEVE/2/RB11.JPG';
import rbmImg from '../assets/collection/ELEVE/2/RBM.JPG';
import rd11Img from '../assets/collection/ELEVE/2/RD11.JPG';
import rdmImg from '../assets/collection/ELEVE/2/RDM.JPG';
import rg11Img from '../assets/collection/ELEVE/2/RG11.JPG';
import rgmImg from '../assets/collection/ELEVE/2/RGM.JPG';

// Elevé Bracelets
import bd11Img from '../assets/collection/ELEVE/5/BRACELET/BD11.JPG';
import bdmImg from '../assets/collection/ELEVE/5/BRACELET/BD/BDM.JPG';
import br11Img from '../assets/collection/ELEVE/5/BRACELET/BR/BR11.JPG';
import brmImg from '../assets/collection/ELEVE/5/BRACELET/BR/BRM.JPG';
import bb11Img from '../assets/collection/ELEVE/5/BRACELET/BB11.JPG';
import bbmImg from '../assets/collection/ELEVE/5/BRACELET/BBM.JPG';

// Éclat Initial Pendants
import eclatA0Img from '../assets/collection/ECLAT INITIAL/AM-P000444-A-ELE_0.JPG';
import eclatA3Img from '../assets/collection/ECLAT INITIAL/AM-P000444-A-ELE_3.JPG';
import eclatB0Img from '../assets/collection/ECLAT INITIAL/AM-P000444-B-ELE_0.JPG';
import eclatB3Img from '../assets/collection/ECLAT INITIAL/AM-P000444-B-ELE_3.JPG';
import eclatH0Img from '../assets/collection/ECLAT INITIAL/AM-P000444-H-ELE_0.JPG';
import eclatH3Img from '../assets/collection/ECLAT INITIAL/AM-P000444-H-ELE_3.JPG';

// Apex Spark Pendants
import amp11cImg from '../assets/collection/Apex Spark/All Photos/AMP110011_C.JPG';
import amp12eImg from '../assets/collection/Apex Spark/All Photos/AMP110012_E.JPG';
import amp14cImg from '../assets/collection/Apex Spark/All Photos/AMP110014_C.JPG';
import amp14dImg from '../assets/collection/Apex Spark/All Photos/AMP110014_D.JPG';

// Elevé Earrings
import earLgs1Img from '../assets/collection/ELEVE/4/AM-E000502-LGS_1.JPG';
import earLgr1Img from '../assets/collection/ELEVE/4/AM-E000502-LGR_1.JPG';
import erb11Img from '../assets/collection/ELEVE/4/ERB11.JPG';
import erg11Img from '../assets/collection/ELEVE/4/ERG11.JPG';

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
export const products = [
  // Love & Engagement - Sapphire Ring
  {
    id: "le-ring-sapphire",
    name: "Sapphire Engagement Ring",
    price: 4500,
    category: "rings",
    collection: "love-engagement",
    description: "Stunning sapphire engagement ring with brilliant cut diamonds.",
    material: "Platinum",
    gemstone: "Sapphire & Diamond",
    image: db1Img,
    gallery: [db1Img, db1mImg],
    featured: true,
    inStock: true
  },
  // Love & Engagement - Emerald Ring
  {
    id: "le-ring-emerald",
    name: "Emerald Engagement Ring",
    price: 4800,
    category: "rings",
    collection: "love-engagement",
    description: "Exquisite emerald engagement ring with diamond accents.",
    material: "Platinum",
    gemstone: "Emerald & Diamond",
    image: dg13Img,
    gallery: [dg13Img, dg1mImg],
    featured: true,
    inStock: true
  },
  // Love & Engagement - Ruby Ring
  {
    id: "le-ring-ruby",
    name: "Ruby Engagement Ring",
    price: 4600,
    category: "rings",
    collection: "love-engagement",
    description: "Elegant ruby engagement ring with diamond setting.",
    material: "Platinum",
    gemstone: "Ruby & Diamond",
    image: dr1Img,
    gallery: [dr1Img, dr1mImg],
    featured: true,
    inStock: true
  },
  // Love & Engagement - Diamond Ring
  {
    id: "le-ring-diamond",
    name: "Classic Diamond Engagement Ring",
    price: 5200,
    category: "rings",
    collection: "love-engagement",
    description: "Timeless diamond engagement ring with platinum band.",
    material: "Platinum",
    gemstone: "Diamond",
    image: d13Img,
    gallery: [d13Img, d1mImg],
    featured: true,
    inStock: true
  },
  // Elevé - Ruby Ring
  {
    id: "eleve-ring-ruby",
    name: "Elevé Ruby Ring",
    price: 3200,
    category: "rings",
    collection: "eleve",
    description: "Elegant ruby ring with refined design.",
    material: "18k Gold",
    gemstone: "Ruby",
    image: rb11Img,
    gallery: [rb11Img, rbmImg],
    featured: true,
    inStock: true
  },
  // Elevé - Diamond Ring
  {
    id: "eleve-ring-diamond",
    name: "Elevé Diamond Ring",
    price: 3500,
    category: "rings",
    collection: "eleve",
    description: "Sophisticated diamond ring with timeless elegance.",
    material: "18k White Gold",
    gemstone: "Diamond",
    image: rd11Img,
    gallery: [rd11Img, rdmImg],
    featured: true,
    inStock: true
  },
  // Elevé - Gold Ring
  {
    id: "eleve-ring-gold",
    name: "Elevé Gold Ring",
    price: 2800,
    category: "rings",
    collection: "eleve",
    description: "Classic gold ring with elevated design.",
    material: "18k Yellow Gold",
    gemstone: "Diamond",
    image: rg11Img,
    gallery: [rg11Img, rgmImg],
    featured: true,
    inStock: true
  },
  // Elevé - Diamond Bracelet
  {
    id: "eleve-bracelet-diamond",
    name: "Elevé Diamond Bracelet",
    price: 4200,
    category: "bracelets",
    collection: "eleve",
    description: "Elegant diamond bracelet with refined craftsmanship.",
    material: "18k White Gold",
    gemstone: "Diamond",
    image: bd11Img,
    gallery: [bd11Img, bdmImg],
    featured: true,
    inStock: true
  },
  // Elevé - Ruby Bracelet
  {
    id: "eleve-bracelet-ruby",
    name: "Elevé Ruby Bracelet",
    price: 3900,
    category: "bracelets",
    collection: "eleve",
    description: "Stunning ruby bracelet with timeless elegance.",
    material: "18k Rose Gold",
    gemstone: "Ruby",
    image: br11Img,
    gallery: [br11Img, brmImg],
    featured: true,
    inStock: true
  },
  // Elevé - Gold Bracelet
  {
    id: "eleve-bracelet-gold",
    name: "Elevé Gold Bracelet",
    price: 3500,
    category: "bracelets",
    collection: "eleve",
    description: "Classic gold bracelet with sophisticated design.",
    material: "18k Yellow Gold",
    gemstone: "Diamond",
    image: bb11Img,
    gallery: [bb11Img, bbmImg],
    featured: true,
    inStock: true
  },
  // Éclat Initial - A Pendant
  {
    id: "eclat-pendant-a",
    name: "Éclat Initial A Pendant",
    price: 1200,
    category: "necklaces",
    collection: "eclat-initial",
    description: "Personalized initial A pendant with diamond accents.",
    material: "18k Gold",
    gemstone: "Diamond",
    image: eclatA0Img,
    gallery: [eclatA0Img, eclatA3Img],
    featured: true,
    inStock: true
  },
  // Éclat Initial - B Pendant
  {
    id: "eclat-pendant-b",
    name: "Éclat Initial B Pendant",
    price: 1200,
    category: "necklaces",
    collection: "eclat-initial",
    description: "Personalized initial B pendant with diamond accents.",
    material: "18k Gold",
    gemstone: "Diamond",
    image: eclatB0Img,
    gallery: [eclatB0Img, eclatB3Img],
    featured: true,
    inStock: true
  },
  // Éclat Initial - H Pendant
  {
    id: "eclat-pendant-h",
    name: "Éclat Initial H Pendant",
    price: 1200,
    category: "necklaces",
    collection: "eclat-initial",
    description: "Personalized initial H pendant with diamond accents.",
    material: "18k Gold",
    gemstone: "Diamond",
    image: eclatH0Img,
    gallery: [eclatH0Img, eclatH3Img],
    featured: true,
    inStock: true
  },
  // Apex Spark - Pendant 1
  {
    id: "apex-pendant-1",
    name: "Apex Spark Diamond Pendant",
    price: 2800,
    category: "necklaces",
    collection: "apex-spark",
    description: "Bold diamond pendant with striking design.",
    material: "Platinum",
    gemstone: "Diamond",
    image: amp11cImg,
    gallery: [amp11cImg, amp12eImg],
    featured: true,
    inStock: true
  },
  // Apex Spark - Pendant 2
  {
    id: "apex-pendant-2",
    name: "Apex Spark Statement Pendant",
    price: 3200,
    category: "necklaces",
    collection: "apex-spark",
    description: "Statement pendant with brilliant sparkle.",
    material: "Platinum",
    gemstone: "Diamond",
    image: amp14cImg,
    gallery: [amp14cImg, amp14dImg],
    featured: true,
    inStock: true
  },
  // Elevé - Gold Stud Earrings
  {
    id: "eleve-earring-gold-stud",
    name: "Elevé Gold Stud Earrings",
    price: 1800,
    category: "earrings",
    collection: "eleve",
    description: "Elegant gold stud earrings with refined design.",
    material: "18k Gold",
    gemstone: "Diamond",
    image: earLgs1Img,
    gallery: [earLgs1Img],
    featured: true,
    inStock: true
  },
  // Elevé - Rose Gold Earrings
  {
    id: "eleve-earring-rose-gold",
    name: "Elevé Rose Gold Earrings",
    price: 2100,
    category: "earrings",
    collection: "eleve",
    description: "Sophisticated rose gold earrings with timeless appeal.",
    material: "18k Rose Gold",
    gemstone: "Diamond",
    image: earLgr1Img,
    gallery: [earLgr1Img],
    featured: true,
    inStock: true
  },
  // Elevé - Ruby Earrings
  {
    id: "eleve-earring-ruby",
    name: "Elevé Ruby Earrings",
    price: 2400,
    category: "earrings",
    collection: "eleve",
    description: "Stunning ruby earrings with elegant design.",
    material: "18k Gold",
    gemstone: "Ruby",
    image: erb11Img,
    gallery: [erb11Img],
    featured: true,
    inStock: true
  },
  // Elevé - Emerald Earrings
  {
    id: "eleve-earring-emerald",
    name: "Elevé Emerald Earrings",
    price: 2500,
    category: "earrings",
    collection: "eleve",
    description: "Exquisite emerald earrings with refined craftsmanship.",
    material: "18k Gold",
    gemstone: "Emerald",
    image: erg11Img,
    gallery: [erg11Img],
    featured: true,
    inStock: true
  }
];



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

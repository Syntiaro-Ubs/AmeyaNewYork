const db = require('./db');

async function seed() {
  const sections = [
    {
      slug: 'hero',
      name: 'Hero Banner',
      title: 'Jewelry That Tells Your Story',
      subtitle: 'Jewelry That Tells Your Story',
      description: '',
      media_url: '',
      link_url: '/category/new-arrivals',
      is_visible: true
    },
    {
      slug: 'featured-collections',
      name: 'Exclusive Collection',
      title: 'Exclusive Collection',
      subtitle: 'Discover the Collection',
      description: '',
      content_json: JSON.stringify(['eleve', 'eclat-initial', 'love-engagement']),
      is_visible: true
    },
    {
      slug: 'collection-cards',
      name: 'Collections Grid',
      title: 'Collections',
      subtitle: 'Explore our curated collections, each telling a unique story',
      description: '',
      content_json: JSON.stringify(['apex-spark', 'eleve', 'eclat-initial', 'love-engagement']),
      is_visible: true
    },
    {
      slug: 'category-grid',
      name: 'Shop by Category',
      title: 'Shop by Category',
      subtitle: 'Browse our categories',
      description: '',
      is_visible: true
    },
    {
      slug: 'product-spotlight',
      name: 'The SpotLight',
      title: 'The SpotLight',
      subtitle: 'Featured Piece',
      description: '',
      is_visible: true
    },
    {
      slug: 'brand-story',
      name: 'Our Signature Collections',
      title: 'Our Signature Collections',
      subtitle: 'The Pinnacle of Design',
      description: '',
      content_json: JSON.stringify(['apex-spark', 'eleve']),
      is_visible: true
    },
    {
      slug: 'instagram-feed',
      name: 'Instagram Post Sections',
      title: '@AmeyaNewYork',
      subtitle: 'Follow us for daily inspiration',
      description: '',
      content_json: JSON.stringify([]),
      is_visible: true
    }
  ];

  console.log('Seeding homepage sections...');

  for (const s of sections) {
    try {
      await db.query(`
        INSERT INTO homepage_sections (section_slug, section_name, title, subtitle, description, media_url, link_url, content_json, is_visible)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          section_name = VALUES(section_name),
          title = VALUES(title),
          subtitle = VALUES(subtitle),
          description = VALUES(description),
          media_url = IF(media_url IS NULL OR media_url = '', VALUES(media_url), media_url),
          link_url = VALUES(link_url),
          content_json = VALUES(content_json),
          is_visible = VALUES(is_visible)
      `, [s.slug, s.name, s.title, s.subtitle, s.description, s.media_url, s.link_url, s.content_json || null, s.is_visible]);
      console.log(`- Seeded ${s.slug}`);
    } catch (err) {
      console.error(`Error seeding ${s.slug}:`, err.message);
    }
  }

  console.log('Seed completed.');
  process.exit(0);
}

seed();

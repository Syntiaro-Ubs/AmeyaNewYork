import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Sparkles, Heart, Award, Users, ArrowRight } from 'lucide-react';

export function OurStory() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80" 
          alt="AMEYA New York Atelier"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-white/90 text-[10px] uppercase tracking-[0.4em] mb-4">
              Est. New York
            </p>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight">
              Our Story
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Where timeless elegance meets modern artistry
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] uppercase tracking-[0.36em] text-[var(--primary)] mb-4">
            The Beginning
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-8 leading-tight">
            A Legacy of Excellence
          </h2>
          <div className="w-16 h-px bg-[var(--primary)] mx-auto mb-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6 text-[var(--muted-foreground)] leading-relaxed">
            <p className="text-lg">
              Born in the heart of New York City, AMEYA represents more than just fine jewelry—it embodies 
              a philosophy of timeless elegance, meticulous craftsmanship, and the celebration of life's 
              most precious moments.
            </p>
            <p>
              Our journey began with a simple vision: to create pieces that transcend trends and become 
              cherished heirlooms, passed down through generations. Each creation is a testament to our 
              unwavering commitment to excellence and our deep respect for the art of jewelry making.
            </p>
            <p>
              Drawing inspiration from the vibrant energy of New York and the timeless beauty of classical 
              design, we craft pieces that speak to the modern woman who values both tradition and innovation.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <img 
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80"
              alt="Jewelry craftsmanship"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="bg-[#f8f7f5] py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-[10px] uppercase tracking-[0.36em] text-[var(--primary)] mb-4">
              Our Values
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-6">
              The Art of Craftsmanship
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
              Behind every piece lies a story of dedication, skill, and an unwavering commitment to perfection.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Ethically Sourced',
                description: 'Every gemstone is carefully selected and ethically sourced from trusted partners worldwide.'
              },
              {
                icon: Award,
                title: 'Master Crafted',
                description: 'Our artisans bring decades of expertise to create pieces that transcend time.'
              },
              {
                icon: Heart,
                title: 'Made with Love',
                description: 'Each creation is infused with passion, reflecting our dedication to excellence.'
              },
              {
                icon: Users,
                title: 'Client Focused',
                description: 'Your vision guides our craft, ensuring every piece tells your unique story.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-sm text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <value.icon size={24} className="text-[var(--primary)]" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-[var(--foreground)] mb-3">
                  {value.title}
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Process */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-[10px] uppercase tracking-[0.36em] text-[var(--primary)] mb-4">
              Our Process
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-6">
              From Vision to Reality
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Design & Inspiration',
                description: 'Every piece begins with inspiration drawn from art, architecture, and the natural world. Our designers sketch and refine each concept with meticulous attention to detail.',
                image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&q=80'
              },
              {
                step: '02',
                title: 'Handcrafted Excellence',
                description: 'Master artisans bring designs to life using time-honored techniques passed down through generations, combined with modern precision tools.',
                image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80'
              },
              {
                step: '03',
                title: 'Quality Assurance',
                description: 'Each piece undergoes rigorous quality checks to ensure it meets our exacting standards before being presented to you with certification.',
                image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80'
              }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6">
                  <img 
                    src={process.image}
                    alt={process.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 w-12 h-12 bg-white/95 backdrop-blur-sm flex items-center justify-center">
                    <span className="font-serif text-lg text-[var(--primary)]">{process.step}</span>
                  </div>
                </div>
                <h3 className="font-serif text-2xl text-[var(--foreground)] mb-3">
                  {process.title}
                </h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  {process.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="bg-[#f8f7f5] py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <div className="order-2 md:order-1">
              <p className="text-[10px] uppercase tracking-[0.36em] text-[var(--primary)] mb-4">
                Heritage
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-6 leading-tight">
                New York's Finest
              </h2>
              <div className="w-16 h-px bg-[var(--primary)] mb-8" />
              <div className="space-y-6 text-[var(--muted-foreground)] leading-relaxed">
                <p>
                  Located in the heart of New York City, our atelier serves as both a creative studio 
                  and a sanctuary for those who appreciate the finer things in life. Here, tradition 
                  meets innovation in an environment designed to inspire.
                </p>
                <p>
                  We invite you to visit our showroom, where you can experience our collections firsthand 
                  and work with our expert consultants to create or customize the perfect piece for your 
                  unique story.
                </p>
                <p className="font-serif text-xl text-[var(--foreground)] italic">
                  "Jewelry is not just an accessory—it's a legacy."
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2 relative aspect-[3/4] overflow-hidden rounded-sm">
              <img 
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"
                alt="AMEYA Atelier"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-6">
            Begin Your Journey
          </h2>
          <p className="text-[var(--muted-foreground)] text-lg mb-10 leading-relaxed">
            Let us help you find the perfect piece that tells your unique story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[var(--foreground)] text-white text-[11px] uppercase tracking-[0.24em] hover:opacity-80 transition-opacity"
            >
              Schedule Consultation
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
            <Link 
              to="/#collections"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-[var(--foreground)] text-[var(--foreground)] text-[11px] uppercase tracking-[0.24em] hover:bg-[var(--foreground)] hover:text-white transition-all"
            >
              View Collections
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

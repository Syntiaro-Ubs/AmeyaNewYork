import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Sparkles, Users, Heart, TrendingUp, ArrowRight, Mail } from 'lucide-react';

export function Careers() {

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80" 
          alt="AMEYA Team"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-white/90 text-[10px] uppercase tracking-[0.4em] mb-4">
              Join Our Team
            </p>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight">
              Careers at AMEYA
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Craft your future with us
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] uppercase tracking-[0.36em] text-[var(--primary)] mb-4">
            Why AMEYA
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-8 leading-tight">
            Where Passion Meets Purpose
          </h2>
          <div className="w-16 h-px bg-[var(--primary)] mx-auto mb-10" />
          <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-6">
            At AMEYA, we believe that exceptional jewelry begins with exceptional people. Our team 
            is a diverse collective of artists, craftsmen, designers, and visionaries united by a 
            shared passion for creating timeless beauty.
          </p>
          <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
            Join us in our New York atelier, where tradition meets innovation, and every day brings 
            new opportunities to create pieces that will be treasured for generations.
          </p>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="bg-[#f8f7f5] py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-[10px] uppercase tracking-[0.36em] text-[var(--primary)] mb-4">
              Benefits & Culture
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-6">
              Why Work With Us
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: 'Passion-Driven Culture',
                description: 'Work alongside artisans and designers who share your love for exceptional craftsmanship.'
              },
              {
                icon: TrendingUp,
                title: 'Growth & Development',
                description: 'Continuous learning opportunities and career advancement in a growing luxury brand.'
              },
              {
                icon: Users,
                title: 'Collaborative Environment',
                description: 'Be part of a close-knit team where every voice matters and creativity thrives.'
              },
              {
                icon: Sparkles,
                title: 'Competitive Benefits',
                description: 'Comprehensive health coverage, retirement plans, employee discounts, and more.'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-sm text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <benefit.icon size={24} className="text-[var(--primary)]" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-[var(--foreground)] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-[10px] uppercase tracking-[0.36em] text-[var(--primary)] mb-4">
              Apply Now
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-6">
              Join Our Team
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#f8f7f5] p-8 md:p-12 rounded-sm"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[var(--foreground)] mb-3">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3.5 bg-white border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[var(--foreground)] mb-3">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3.5 bg-white border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[var(--foreground)] mb-3">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3.5 bg-white border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[var(--foreground)] mb-3">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3.5 bg-white border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Position Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[var(--foreground)] mb-3">
                    Position Applied For *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3.5 bg-white border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                  >
                    <option value="">Select a position</option>
                    <option value="designer">Senior Jewelry Designer</option>
                    <option value="goldsmith">Master Goldsmith</option>
                    <option value="gemologist">Gemologist</option>
                    <option value="client-specialist">Client Experience Specialist</option>
                    <option value="marketing">Digital Marketing Manager</option>
                    <option value="ecommerce">E-commerce Manager</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[var(--foreground)] mb-3">
                    Years of Experience *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3.5 bg-white border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                  >
                    <option value="">Select experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>

              {/* LinkedIn & Portfolio */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[var(--foreground)] mb-3">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3.5 bg-white border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[var(--foreground)] mb-3">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3.5 bg-white border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[var(--foreground)] mb-3">
                  Cover Letter / Why AMEYA? *
                </label>
                <textarea
                  required
                  rows="6"
                  className="w-full px-4 py-3.5 bg-white border border-[var(--border)] text-[var(--foreground)] text-sm leading-relaxed focus:outline-none focus:border-[var(--primary)] transition-colors resize"
                  placeholder="Tell us why you'd like to join the AMEYA team and what makes you a great fit..."
                ></textarea>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[var(--foreground)] mb-3">
                  When can you start? *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3.5 bg-white border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 flex justify-center">
                <button
                  type="submit"
                  className="px-16 py-4 bg-[var(--foreground)] text-white text-[11px] uppercase tracking-[0.24em] hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
                >
                  Submit Application
                  <ArrowRight size={14} strokeWidth={1.5} />
                </button>
              </div>

              <p className="text-[10px] text-[var(--muted-foreground)] text-center">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-6">
            Don't See the Right Role?
          </h2>
          <p className="text-[var(--muted-foreground)] text-lg mb-10 leading-relaxed">
            We're always looking for talented individuals to join our team. Send us your resume 
            and tell us how you'd like to contribute to the AMEYA story.
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[var(--foreground)] text-white text-[11px] uppercase tracking-[0.24em] hover:opacity-80 transition-opacity"
          >
            <Mail size={14} strokeWidth={1.5} />
            Get in Touch
          </Link>
        </motion.div>
      </section>

    </div>
  );
}

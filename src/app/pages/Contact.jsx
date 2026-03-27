import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Calendar, ArrowRight, User, Globe } from 'lucide-react';
import { toast } from 'sonner';
export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    appointmentType: 'consultation',
    date: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Appointment request sent successfully! We will contact you shortly to confirm.");
    setFormData({
      name: '',
      email: '',
      phone: '',
      appointmentType: 'consultation',
      date: '',
      message: ''
    });
    setIsSubmitting(false);
  };
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <div className="bg-[var(--background)] min-h-screen pt-24 pb-16">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--foreground)] tracking-wide">
            Concierge Services
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto font-sans text-lg font-light">
            Experience personalized luxury service. Whether you prefer a direct conversation or a scheduled consultation, our experts are at your disposal.
          </p>
        </div>

        {/* Hero Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
          {/* Call Option */}
          <motion.div whileHover={{
          y: -5
        }} className="group relative overflow-hidden bg-white dark:bg-[var(--card)] border border-[var(--border)] p-10 flex flex-col items-center text-center rounded-sm shadow-sm hover:shadow-md transition-all duration-300">
            <div className="bg-[var(--secondary)] p-4 rounded-full mb-6 group-hover:bg-[var(--primary)] transition-colors duration-300">
              <Phone className="w-8 h-8 text-[var(--primary)] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-[var(--foreground)] mb-3">Contact Us Directly</h2>
            <p className="text-[var(--muted-foreground)] mb-8 font-light text-sm max-w-xs">
              Speak with a dedicated advisor immediately for inquiries about our collections or services.
            </p>
            <a href="tel:+12125550123" className="inline-flex items-center justify-center px-8 py-3 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-300 uppercase tracking-widest text-xs font-medium rounded-sm">
              Call +1 (212) 555-0123
            </a>
          </motion.div>

          {/* Book Appointment Option */}
          <motion.div whileHover={{
          y: -5
        }} className="group relative overflow-hidden bg-white dark:bg-[var(--card)] border border-[var(--border)] p-10 flex flex-col items-center text-center rounded-sm shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer" onClick={scrollToForm}>
            <div className="bg-[var(--secondary)] p-4 rounded-full mb-6 group-hover:bg-[var(--primary)] transition-colors duration-300">
              <Calendar className="w-8 h-8 text-[var(--primary)] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-[var(--foreground)] mb-3">Book an Appointment</h2>
            <p className="text-[var(--muted-foreground)] mb-8 font-light text-sm max-w-xs">
              Schedule a private consultation, virtual or in-store, to explore our exquisite pieces.
            </p>
            <button onClick={e => {
            e.stopPropagation();
            scrollToForm();
          }} className="inline-flex items-center justify-center px-8 py-3 bg-[var(--primary)] text-white hover:bg-[var(--emerald-900)] transition-all duration-300 uppercase tracking-widest text-xs font-medium rounded-sm">
              Schedule Consultation
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          {/* Left Column: Image & Info */}
          <div className="lg:col-span-5 space-y-10">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="relative overflow-hidden rounded-sm h-[400px] w-full shadow-md">
              <img src="https://images.unsplash.com/photo-1754573433744-bf2b79d0eaf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwYm91dGlxdWUlMjBpbnRlcmlvciUyMGVsZWdhbnR8ZW58MXx8fHwxNzcxOTk1NTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="AMEYA New York Boutique" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
                <p className="font-serif text-xl">New York Flagship</p>
                <p className="text-sm font-light opacity-90">Experience luxury in person</p>
              </div>
            </motion.div>

            <div className="bg-white dark:bg-[var(--card)] p-8 border border-[var(--border)] rounded-sm space-y-6">
              <h3 className="font-serif text-2xl text-[var(--foreground)] mb-4 border-b border-[var(--border)] pb-2">Boutique Information</h3>
              
              <div className="flex items-start space-x-4">
                <MapPin className="text-[var(--primary)] mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-[var(--foreground)]">Address</p>
                  <p className="text-[var(--muted-foreground)] font-light text-sm mt-1">
                    123 Fifth Avenue, Suite 400<br />
                    New York, NY 10010<br />
                    United States
                  </p>
                  <a href="#" className="text-[var(--primary)] text-xs uppercase tracking-wider mt-2 inline-block hover:underline">Get Directions</a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="text-[var(--primary)] mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-[var(--foreground)]">Email Support</p>
                  <p className="text-[var(--muted-foreground)] font-light text-sm mt-1">
                    contact@ameyajewelry.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="text-[var(--primary)] mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-[var(--foreground)]">Opening Hours</p>
                  <p className="text-[var(--muted-foreground)] font-light text-sm mt-1">
                    Mon - Sat: 10:00 AM - 7:00 PM<br />
                    Sun: 12:00 PM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Appointment Form */}
          <motion.div id="appointment-form" ref={formRef} initial={{
          opacity: 0,
          x: 20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="lg:col-span-7 bg-white dark:bg-[var(--card)] p-8 md:p-12 border border-[var(--border)] shadow-sm rounded-sm h-fit">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-[var(--primary)] font-serif text-lg italic">Request Appointment</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--foreground)] mb-6">Personalized Consultation</h2>
            <p className="text-[var(--muted-foreground)] mb-10 font-light text-sm leading-relaxed">
              Whether you are looking for the perfect engagement ring, a special gift, or a custom design, our jewelry experts are here to guide you. Fill out the form below to request an appointment.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-medium text-[var(--foreground)] uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] h-4 w-4" />
                    <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-[var(--input-background)] border border-[var(--input)] focus:border-[var(--primary)] outline-none transition-colors text-sm rounded-sm" placeholder="Your Name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-medium text-[var(--foreground)] uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] h-4 w-4" />
                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-[var(--input-background)] border border-[var(--input)] focus:border-[var(--primary)] outline-none transition-colors text-sm rounded-sm" placeholder="email@example.com" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-medium text-[var(--foreground)] uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] h-4 w-4" />
                    <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-[var(--input-background)] border border-[var(--input)] focus:border-[var(--primary)] outline-none transition-colors text-sm rounded-sm" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="appointmentType" className="text-xs font-medium text-[var(--foreground)] uppercase tracking-wider">Service Type</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] h-4 w-4" />
                    <select id="appointmentType" name="appointmentType" value={formData.appointmentType} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-[var(--input-background)] border border-[var(--input)] focus:border-[var(--primary)] outline-none transition-colors text-sm appearance-none rounded-sm">
                      <option value="consultation">In-Store Consultation</option>
                      <option value="virtual">Virtual Consultation</option>
                      <option value="custom">Custom Design Inquiry</option>
                      <option value="engagement">Bridal & Engagement</option>
                      <option value="service">Repair & After-Care</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="text-xs font-medium text-[var(--foreground)] uppercase tracking-wider">Preferred Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] h-4 w-4" />
                  <input type="date" id="date" name="date" required value={formData.date} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-[var(--input-background)] border border-[var(--input)] focus:border-[var(--primary)] outline-none transition-colors text-sm rounded-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-medium text-[var(--foreground)] uppercase tracking-wider">Additional Details (Optional)</label>
                <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--input)] focus:border-[var(--primary)] outline-none transition-colors text-sm resize-none rounded-sm" placeholder="Please let us know if you have specific questions or are interested in particular pieces..." />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-[var(--primary)] text-white hover:bg-[var(--emerald-900)] py-3 px-8 transition-all duration-300 uppercase tracking-widest text-xs font-medium flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6 rounded-sm shadow-md hover:shadow-lg transform active:scale-[0.99]">
                {isSubmitting ? <span>Submitting Request...</span> : <>
                    <span>Confirm Appointment Request</span>
                    <ArrowRight size={16} />
                  </>}
              </button>
              
              <p className="text-center text-xs text-[var(--muted-foreground)] mt-4 font-light">
                By submitting this form, you agree to our Privacy Policy. We will contact you within 24 hours.
              </p>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>;
}

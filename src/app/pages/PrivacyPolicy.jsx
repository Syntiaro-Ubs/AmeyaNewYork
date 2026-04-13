import { motion } from 'motion/react';
import { Shield, Lock, Eye, UserCheck, Mail, FileText } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-[#f8f7f5] py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[var(--primary)]/10">
              <Shield size={32} className="text-[var(--primary)]" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-[var(--foreground)] mb-6">
              Privacy Policy
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
              Last Updated: January 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-6">
              At AMEYA New York, we are committed to protecting your privacy and ensuring the security 
              of your personal information. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website or make a purchase from us.
            </p>
            <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
              Please read this privacy policy carefully. If you do not agree with the terms of this 
              privacy policy, please do not access the site.
            </p>
          </motion.div>

          {/* Information We Collect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10">
                <FileText size={20} className="text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-[var(--foreground)]">
                Information We Collect
              </h2>
            </div>
            <div className="space-y-6 text-[var(--muted-foreground)] leading-relaxed">
              <div>
                <h3 className="font-serif text-xl text-[var(--foreground)] mb-3">
                  Personal Information
                </h3>
                <p className="mb-3">
                  We collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                    Register for an account
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                    Make a purchase or place an order
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                    Subscribe to our newsletter
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                    Contact us with inquiries
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                    Participate in surveys or promotions
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-xl text-[var(--foreground)] mb-3">
                  Information Collected Automatically
                </h3>
                <p>
                  When you visit our website, we automatically collect certain information about your 
                  device, including information about your web browser, IP address, time zone, and some 
                  of the cookies installed on your device. We also collect information about your browsing 
                  behavior and purchase history.
                </p>
              </div>
            </div>
          </motion.div>

          {/* How We Use Your Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10">
                <UserCheck size={20} className="text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-[var(--foreground)]">
                How We Use Your Information
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
              <p>We use the information we collect to:</p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Process and fulfill your orders
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Communicate with you about your orders and inquiries
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Send you marketing communications (with your consent)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Improve and personalize your shopping experience
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Detect and prevent fraud or security issues
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Comply with legal obligations
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Information Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10">
                <Eye size={20} className="text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-[var(--foreground)]">
                Information Sharing
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share 
                your information with:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Service providers who assist us in operating our website and conducting our business
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Payment processors to facilitate transactions
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Shipping companies to deliver your orders
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Law enforcement or regulatory authorities when required by law
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Data Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10">
                <Lock size={20} className="text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-[var(--foreground)]">
                Data Security
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
              <p>
                We implement appropriate technical and organizational security measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction. 
                These measures include:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  SSL encryption for data transmission
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Secure servers and databases
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Regular security audits and updates
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Limited access to personal information by authorized personnel only
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Your Rights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-serif text-3xl text-[var(--foreground)] mb-6">
              Your Rights
            </h2>
            <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
              <p>You have the right to:</p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Access and receive a copy of your personal information
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Correct inaccurate or incomplete information
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Request deletion of your personal information
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Opt-out of marketing communications
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                  Object to processing of your personal information
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-serif text-3xl text-[var(--foreground)] mb-6">
              Cookies and Tracking
            </h2>
            <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience, 
                analyze site traffic, and understand where our visitors are coming from. You can control 
                cookies through your browser settings.
              </p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#f8f7f5] p-8 md:p-10 rounded-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10">
                <Mail size={20} className="text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-[var(--foreground)]">
                Contact Us
              </h2>
            </div>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-6">
              If you have any questions about this Privacy Policy or wish to exercise your rights, 
              please contact us at:
            </p>
            <div className="space-y-2 text-[var(--muted-foreground)]">
              <p className="font-medium text-[var(--foreground)]">AMEYA New York</p>
              <p>Email: privacy@ameyanewyork.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: New York, NY 10001</p>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}

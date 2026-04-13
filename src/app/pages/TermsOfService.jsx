import { motion } from 'motion/react';
import { FileText, ShoppingBag, RefreshCw, CreditCard, AlertCircle, Mail } from 'lucide-react';

export function TermsOfService() {
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
              <FileText size={32} className="text-[var(--primary)]" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-[var(--foreground)] mb-6">
              Terms of Service
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
              Welcome to AMEYA New York. These Terms of Service ("Terms") govern your use of our website 
              and the purchase of products from us. By accessing our website or making a purchase, you 
              agree to be bound by these Terms.
            </p>
            <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
              Please read these Terms carefully before using our services. If you do not agree with any 
              part of these Terms, you may not access our website or purchase our products.
            </p>
          </motion.div>

          {/* General Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-serif text-3xl text-[var(--foreground)] mb-6">
              General Terms
            </h2>
            <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
              <p>
                By using this website, you represent that you are at least 18 years of age and have the 
                legal capacity to enter into binding contracts. You agree to provide accurate, current, 
                and complete information during the registration and purchase process.
              </p>
              <p>
                We reserve the right to refuse service, terminate accounts, or cancel orders at our sole 
                discretion, including but not limited to situations involving suspected fraud, violations 
                of these Terms, or any other reason we deem appropriate.
              </p>
            </div>
          </motion.div>

          {/* Products and Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10">
                <ShoppingBag size={20} className="text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-[var(--foreground)]">
                Products and Orders
              </h2>
            </div>
            <div className="space-y-6 text-[var(--muted-foreground)] leading-relaxed">
              <div>
                <h3 className="font-serif text-xl text-[var(--foreground)] mb-3">
                  Product Information
                </h3>
                <p>
                  We strive to display our products as accurately as possible. However, we cannot guarantee 
                  that your device's display of colors or details will be completely accurate. All products 
                  are subject to availability, and we reserve the right to discontinue any product at any time.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-[var(--foreground)] mb-3">
                  Pricing
                </h3>
                <p className="mb-3">
                  All prices are listed in USD and are subject to change without notice. We reserve the right 
                  to correct any pricing errors on our website. In the event of a pricing error, we will contact 
                  you for instructions or cancel your order and notify you of the cancellation.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-[var(--foreground)] mb-3">
                  Order Acceptance
                </h3>
                <p>
                  Your receipt of an order confirmation does not signify our acceptance of your order. We reserve 
                  the right to accept or decline your order for any reason. If we cancel your order after payment 
                  has been processed, we will issue a full refund.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Payment Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10">
                <CreditCard size={20} className="text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-[var(--foreground)]">
                Payment Terms
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
              <p>
                We accept various payment methods including major credit cards, debit cards, and other payment 
                options as displayed at checkout. Payment must be received in full before your order is processed.
              </p>
              <p>
                By providing payment information, you represent and warrant that you are authorized to use the 
                payment method and authorize us to charge the total amount of your purchase to that payment method.
              </p>
              <p>
                All transactions are processed through secure, encrypted payment gateways. We do not store your 
                complete credit card information on our servers.
              </p>
            </div>
          </motion.div>

          {/* Shipping and Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-serif text-3xl text-[var(--foreground)] mb-6">
              Shipping and Delivery
            </h2>
            <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
              <p>
                We ship to addresses within the United States and select international locations. Shipping 
                costs and delivery times vary based on your location and chosen shipping method.
              </p>
              <p>
                Title and risk of loss pass to you upon delivery to the carrier. We are not responsible for 
                delays caused by shipping carriers or customs clearance processes.
              </p>
              <p>
                You are responsible for providing accurate shipping information. We are not liable for orders 
                shipped to incorrect addresses provided by you.
              </p>
            </div>
          </motion.div>

          {/* Returns and Exchanges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10">
                <RefreshCw size={20} className="text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-[var(--foreground)]">
                Returns and Exchanges
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
              <p>
                We want you to be completely satisfied with your purchase. If you are not satisfied, you may 
                return unworn, undamaged items in their original packaging within 30 days of delivery for a 
                full refund or exchange.
              </p>
              <p>
                Custom or personalized items, earrings, and final sale items are not eligible for return or 
                exchange unless defective.
              </p>
              <p>
                To initiate a return, please contact our customer service team. Return shipping costs are the 
                responsibility of the customer unless the item is defective or we made an error.
              </p>
              <p>
                Refunds will be processed to the original payment method within 7-10 business days after we 
                receive and inspect the returned item.
              </p>
            </div>
          </motion.div>

          {/* Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-serif text-3xl text-[var(--foreground)] mb-6">
              Intellectual Property
            </h2>
            <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
              <p>
                All content on this website, including but not limited to text, graphics, logos, images, 
                designs, and software, is the property of AMEYA New York and is protected by copyright, 
                trademark, and other intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, or create derivative works from any content on 
                this website without our express written permission.
              </p>
            </div>
          </motion.div>

          {/* Limitation of Liability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)]/10">
                <AlertCircle size={20} className="text-[var(--primary)]" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-[var(--foreground)]">
                Limitation of Liability
              </h2>
            </div>
            <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
              <p>
                To the fullest extent permitted by law, AMEYA New York shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages arising out of or relating to your use 
                of our website or products.
              </p>
              <p>
                Our total liability for any claim arising out of or relating to these Terms or your use of our 
                services shall not exceed the amount you paid for the product giving rise to the claim.
              </p>
            </div>
          </motion.div>

          {/* Governing Law */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-serif text-3xl text-[var(--foreground)] mb-6">
              Governing Law
            </h2>
            <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of 
                New York, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms or your use of our services shall be resolved in the 
                courts located in New York, NY.
              </p>
            </div>
          </motion.div>

          {/* Changes to Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-serif text-3xl text-[var(--foreground)] mb-6">
              Changes to Terms
            </h2>
            <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective immediately 
                upon posting to the website. Your continued use of our website after changes are posted 
                constitutes your acceptance of the modified Terms.
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
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="space-y-2 text-[var(--muted-foreground)]">
              <p className="font-medium text-[var(--foreground)]">AMEYA New York</p>
              <p>Email: legal@ameyanewyork.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: New York, NY 10001</p>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}

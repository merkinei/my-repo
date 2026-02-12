import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission - ready for backend integration
    setTimeout(() => {
      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We will get back to you soon.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-6 py-24">
        <div className="max-w-[100rem] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-grey900 rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="text-sm text-grey300">Get in Touch</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl mb-8 text-grey100">
              Contact Us
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-grey400 max-w-3xl mx-auto">
              Have questions or feedback? We'd love to hear from you
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="w-full pb-24">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-grey900 p-8 rounded-lg sticky top-24">
                <h2 className="font-heading text-2xl mb-6 text-grey100">
                  We're Here to Help
                </h2>
                <p className="font-paragraph text-base text-grey400 mb-8">
                  Whether you're a teacher looking for support, a school administrator interested in EduRipple, or just curious about our platform, we welcome your message.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg mb-2 text-grey100">Email Us</h3>
                      <a
                        href="mailto:info@eduripple.co.ke"
                        className="font-paragraph text-base text-primary hover:underline"
                      >
                        info@eduripple.co.ke
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg mb-2 text-grey100">Feedback</h3>
                      <p className="font-paragraph text-base text-grey400">
                        Your input helps us improve EduRipple for all Kenyan teachers
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-grey800">
                  <p className="font-paragraph text-sm text-grey500">
                    We typically respond within 24-48 hours during business days
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-grey900 p-8 rounded-lg">
                <h2 className="font-heading text-2xl mb-8 text-grey100">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-paragraph text-sm text-grey400 mb-2 block">
                        Your Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="bg-background border-grey800 text-grey100 font-paragraph focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-paragraph text-sm text-grey400 mb-2 block">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="bg-background border-grey800 text-grey100 font-paragraph focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-paragraph text-sm text-grey400 mb-2 block">
                      Subject
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="bg-background border-grey800 text-grey100 font-paragraph focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="font-paragraph text-sm text-grey400 mb-2 block">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry or feedback..."
                      className="min-h-[200px] bg-background border-grey800 text-grey100 font-paragraph resize-none focus:border-primary"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground hover:opacity-90 px-8 py-4 font-bold rounded-lg w-full md:w-auto inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Encouragement Section */}
      <section className="w-full bg-grey900 py-24">
        <div className="max-w-[100rem] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-4xl mb-6 text-grey100">
              Your Voice Matters
            </h2>
            <p className="font-paragraph text-lg text-grey400">
              EduRipple is built for teachers, by people who care about education. Your feedback, suggestions, and experiences help us create better tools for the entire Kenyan teaching community. Don't hesitate to reach out—we're listening.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

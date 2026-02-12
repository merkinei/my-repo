import { motion } from 'framer-motion';
import { BookOpen, FileText, ClipboardCheck, Lightbulb, MessageSquare, Download } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Features } from '@/entities';

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Features[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const result = await BaseCrudService.getAll<Features>('features');
      setFeatures(result.items);
    } catch (error) {
      console.error('Error loading features:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const iconMap: Record<string, any> = {
    BookOpen,
    FileText,
    ClipboardCheck,
    Lightbulb,
    MessageSquare,
    Download
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
            <h1 className="font-heading text-5xl md:text-7xl mb-8 text-grey100">
              Powerful Features for Modern Teachers
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-grey400 max-w-3xl mx-auto">
              Everything you need to create professional, CBC-aligned teaching materials in minutes
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-24">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12" style={{ minHeight: isLoading ? '600px' : 'auto' }}>
            {isLoading ? null : features.length > 0 ? (
              features.map((feature, index) => {
                const IconComponent = iconMap[feature.featureName?.replace(/\s+/g, '') || 'BookOpen'] || BookOpen;
                
                return (
                  <motion.div
                    key={feature._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-grey900 p-8 rounded-lg"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading text-2xl mb-4 text-grey100">
                          {feature.featureName}
                        </h3>
                        <p className="font-paragraph text-base text-grey400 mb-6">
                          {feature.description}
                        </p>
                        {feature.benefit && (
                          <div className="bg-background p-4 rounded-lg mb-4">
                            <p className="font-paragraph text-sm text-grey300">
                              <span className="text-primary font-bold">Benefit: </span>
                              {feature.benefit}
                            </p>
                          </div>
                        )}
                        {feature.callToActionText && (
                          <p className="font-paragraph text-sm text-primary font-bold">
                            {feature.callToActionText}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="font-paragraph text-lg text-grey400">No features available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="w-full bg-grey900 py-24">
        <div className="max-w-[100rem] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-5xl mb-6 text-grey100">
              Built for Kenyan Teachers
            </h2>
            <p className="font-paragraph text-lg text-grey400 max-w-2xl mx-auto">
              Every feature is designed with CBC curriculum requirements in mind
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'CBC-Aligned',
                description: 'All generated content follows KICD curriculum guidelines and learning outcomes'
              },
              {
                title: 'Time-Saving',
                description: 'Create comprehensive teaching materials in minutes instead of hours'
              },
              {
                title: 'Easy to Use',
                description: 'Simple prompt-based interface designed for teachers, not tech experts'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background p-8 rounded-lg text-center"
              >
                <h3 className="font-heading text-xl mb-4 text-grey100">{item.title}</h3>
                <p className="font-paragraph text-base text-grey400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

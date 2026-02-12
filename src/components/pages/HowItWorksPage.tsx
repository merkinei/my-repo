import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { HowItWorksSteps } from '@/entities';
import { ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const [steps, setSteps] = useState<HowItWorksSteps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSteps();
  }, []);

  const loadSteps = async () => {
    try {
      const result = await BaseCrudService.getAll<HowItWorksSteps>('howitworkssteps');
      const sortedSteps = result.items.sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0));
      setSteps(sortedSteps);
    } catch (error) {
      console.error('Error loading steps:', error);
    } finally {
      setIsLoading(false);
    }
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
              How EduRipple Works
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-grey400 max-w-3xl mx-auto">
              Four simple steps to transform your teaching preparation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="w-full py-24">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="space-y-24" style={{ minHeight: isLoading ? '800px' : 'auto' }}>
            {isLoading ? null : steps.length > 0 ? (
              steps.map((step, index) => (
                <motion.div
                  key={step._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary-foreground">
                          {step.stepNumber}
                        </span>
                      </div>
                      <h2 className="font-heading text-3xl md:text-4xl text-grey100">
                        {step.title}
                      </h2>
                    </div>
                    <p className="font-paragraph text-lg text-grey400 mb-8">
                      {step.description}
                    </p>
                    {step.callToActionText && step.callToActionUrl && (
                      <Link to={step.callToActionUrl}>
                        <Button className="bg-primary text-primary-foreground hover:opacity-90 px-6 py-3 font-bold rounded-lg inline-flex items-center gap-2">
                          {step.callToActionText}
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    {step.visualGuide && (
                      <div className="bg-grey900 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                        <Image
                          src={step.visualGuide}
                          alt={`Step ${step.stepNumber}: ${step.title}`}
                          width={600}
                          className="rounded-lg w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <p className="font-paragraph text-lg text-grey400">No steps available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-grey900 py-24">
        <div className="max-w-[100rem] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl md:text-5xl mb-6 text-grey100">
              Ready to Get Started?
            </h2>
            <p className="font-paragraph text-lg text-grey400 max-w-2xl mx-auto mb-12">
              Try EduRipple AI and experience how easy teaching preparation can be
            </p>
            <Link to="/ai-chat">
              <Button className="bg-primary text-primary-foreground hover:opacity-90 px-8 py-6 text-lg font-bold rounded-lg">
                Try the AI Assistant
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

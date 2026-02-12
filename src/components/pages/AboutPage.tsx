import { motion } from 'framer-motion';
import { Heart, Target, Users, Award } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { CoreValues } from '@/entities';
import { Image } from '@/components/ui/image';

export default function AboutPage() {
  const [coreValues, setCoreValues] = useState<CoreValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCoreValues();
  }, []);

  const loadCoreValues = async () => {
    try {
      const result = await BaseCrudService.getAll<CoreValues>('corevalues');
      const sorted = result.items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      setCoreValues(sorted);
    } catch (error) {
      console.error('Error loading core values:', error);
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
              About EduRipple
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-grey400 max-w-3xl mx-auto">
              Empowering Kenyan educators with AI-powered tools that respect the CBC curriculum
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-24">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-grey900 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm text-grey300">Our Mission</span>
              </div>
              <h2 className="font-heading text-3xl md:text-5xl mb-6 text-grey100">
                Supporting Teachers, Enhancing Education
              </h2>
              <p className="font-paragraph text-lg text-grey400 mb-6">
                EduRipple was created to address a critical challenge faced by Kenyan Junior Secondary School teachers: the time-consuming process of creating CBC-aligned teaching materials.
              </p>
              <p className="font-paragraph text-lg text-grey400">
                We believe that teachers should spend their time inspiring students, not buried in paperwork. Our AI-powered platform generates professional lesson plans, schemes of work, and assessments that align perfectly with KICD curriculum requirements.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-grey900 p-12 rounded-lg"
            >
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl mb-2 text-grey100">Education-First</h3>
                    <p className="font-paragraph text-base text-grey400">
                      Built by educators who understand the challenges of CBC implementation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl mb-2 text-grey100">KICD-Aligned</h3>
                    <p className="font-paragraph text-base text-grey400">
                      Every output follows official curriculum guidelines and learning outcomes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl mb-2 text-grey100">Teacher-Focused</h3>
                    <p className="font-paragraph text-base text-grey400">
                      Simple interface designed for educators, not tech experts
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
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
              Our Core Values
            </h2>
            <p className="font-paragraph text-lg text-grey400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ minHeight: isLoading ? '400px' : 'auto' }}>
            {isLoading ? null : coreValues.length > 0 ? (
              coreValues.map((value, index) => (
                <motion.div
                  key={value._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background p-8 rounded-lg"
                >
                  {value.iconImage && (
                    <div className="mb-6">
                      <Image
                        src={value.iconImage}
                        alt={value.valueTitle || 'Core value icon'}
                        width={64}
                        className="w-16 h-16"
                      />
                    </div>
                  )}
                  <h3 className="font-heading text-xl mb-4 text-grey100">
                    {value.valueTitle}
                  </h3>
                  <p className="font-paragraph text-base text-grey400 mb-4">
                    {value.description}
                  </p>
                  {value.learnMoreUrl && (
                    <a
                      href={value.learnMoreUrl}
                      className="font-paragraph text-sm text-primary hover:underline"
                    >
                      Learn more →
                    </a>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="font-paragraph text-lg text-grey400">Core values will be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="w-full py-24">
        <div className="max-w-[100rem] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-5xl mb-8 text-grey100">
              Our Educational Philosophy
            </h2>
            <p className="font-paragraph text-lg text-grey400 mb-6">
              We believe that technology should enhance teaching, not replace it. EduRipple is designed to handle the administrative burden of curriculum planning, freeing teachers to focus on what truly matters: inspiring and educating the next generation of Kenyan learners.
            </p>
            <p className="font-paragraph text-lg text-grey400">
              By combining artificial intelligence with deep understanding of the CBC curriculum, we create tools that respect both the teacher's expertise and the student's learning journey.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

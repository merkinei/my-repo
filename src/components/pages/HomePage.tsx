// HPI 1.7-G
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView,
  AnimatePresence
} from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  ClipboardCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Brain, 
  Clock, 
  Shield, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- CANONICAL DATA SOURCES ---
// Preserving original data structures while enhancing for display

const FEATURES_DATA = [
  {
    id: 'lesson-plans',
    icon: BookOpen,
    title: 'Lesson Plans',
    description: 'CBC-aligned lesson plans with learning outcomes, activities, and assessments.',
    detail: 'Instantly generate comprehensive plans that adhere strictly to KICD guidelines.'
  },
  {
    id: 'schemes-work',
    icon: FileText,
    title: 'Schemes of Work',
    description: 'KICD-compliant term and annual schemes organized by strands and sub-strands.',
    detail: 'Effortlessly map out your entire term with structured, compliant schemes.'
  },
  {
    id: 'assessment',
    icon: ClipboardCheck,
    title: 'Assessment Tools',
    description: 'Rubrics, formative assessments, and evaluation criteria tailored to CBC.',
    detail: 'Create fair and consistent grading rubrics for every competency level.'
  },
  {
    id: 'resources',
    icon: Zap,
    title: 'Learning Resources',
    description: 'Curated recommendations for videos, audio, and visual materials.',
    detail: 'Enhance your lessons with AI-suggested multimedia resources.'
  }
];

const BENEFITS_DATA = [
  {
    id: 'save-time',
    title: 'Save Time',
    description: 'Generate complete lesson plans and schemes of work in minutes instead of spending hours on documentation.',
    icon: Clock
  },
  {
    id: 'stay-compliant',
    title: 'Stay Compliant',
    description: 'All materials are aligned with KICD CBC curriculum requirements and learning outcomes.',
    icon: Shield
  },
  {
    id: 'focus-teaching',
    title: 'Focus on Teaching',
    description: 'Spend less time on administrative tasks and more time engaging with your students.',
    icon: Brain
  }
];

const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Enter a Prompt',
    description: 'Teacher enters a prompt (subject, grade, strand).',
    icon: MessageSquare
  },
  {
    step: 2,
    title: 'Processing',
    description: 'EduRipple processes CBC curriculum data.',
    icon: Brain
  },
  {
    step: 3,
    title: 'AI Generation',
    description: 'AI generates structured teaching materials.',
    icon: Sparkles
  },
  {
    step: 4,
    title: 'Review & Download',
    description: 'Teacher reviews, edits, and downloads.',
    icon: FileText
  }
];

// --- UTILITY COMPONENTS ---

const SectionDivider = () => (
  <div className="w-full flex justify-center items-center py-12 opacity-20">
    <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
    <div className="w-2 h-2 rounded-full bg-primary mx-4" />
    <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
  </div>
);

const GridBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#212121_1px,transparent_1px),linear-gradient(to_bottom,#212121_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
  </div>
);

// --- MAIN PAGE COMPONENT ---

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground font-paragraph selection:bg-primary/20 selection:text-primary overflow-clip">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
        <GridBackground />
        
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-grey900/50 border border-grey800 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-grey300 tracking-wide uppercase">AI-Powered CBC Assistant</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-grey100 leading-[1.1] mb-8 tracking-tight"
            >
              AI that Works <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">with the CBC</span>, <br />
              Not Against It.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-paragraph text-lg md:text-xl text-grey400 max-w-2xl mb-10 leading-relaxed"
            >
              EduRipple empowers Kenyan Junior Secondary School teachers to generate compliant lesson plans, schemes of work, and assessments in seconds. Simple, trustworthy, and built for educators.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link to="/ai-chat" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary text-background hover:bg-primary/90 hover:scale-105 transition-all duration-300 h-14 px-8 text-lg font-bold rounded-full shadow-[0_0_20px_rgba(0,188,212,0.3)]">
                  Try the AI Assistant
                </Button>
              </Link>
              <Link to="/how-it-works" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-grey700 text-grey300 hover:text-white hover:border-grey500 hover:bg-grey800 h-14 px-8 text-lg font-medium rounded-full bg-transparent backdrop-blur-sm">
                  See How It Works
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visual / Abstract Representation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:col-span-5 relative hidden lg:block h-[600px]"
          >
             {/* Abstract UI Representation using CSS shapes and glassmorphism */}
             <div className="absolute inset-0 bg-gradient-to-tr from-grey900 to-grey800 rounded-3xl border border-grey800 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-12 bg-grey900 border-b border-grey800 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-secondary/50" />
                </div>
                <div className="p-8 space-y-6 mt-8">
                  <div className="w-3/4 h-8 bg-grey800 rounded-lg animate-pulse" />
                  <div className="w-1/2 h-8 bg-grey800 rounded-lg animate-pulse delay-75" />
                  <div className="w-full h-64 bg-grey900/50 rounded-xl border border-grey800/50 p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="space-y-4">
                      <div className="w-full h-4 bg-grey800 rounded animate-pulse delay-100" />
                      <div className="w-full h-4 bg-grey800 rounded animate-pulse delay-150" />
                      <div className="w-2/3 h-4 bg-grey800 rounded animate-pulse delay-200" />
                    </div>
                    <div className="absolute bottom-6 right-6">
                       <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-primary" />
                       </div>
                    </div>
                  </div>
                </div>
             </div>
             
             {/* Floating Elements Parallax */}
             <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -right-8 top-20 bg-grey900 p-4 rounded-2xl border border-grey700 shadow-xl z-20"
             >
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-secondary/20 rounded-lg">
                   <CheckCircle2 className="w-6 h-6 text-secondary" />
                 </div>
                 <div>
                   <p className="text-xs text-grey400">Status</p>
                   <p className="text-sm font-bold text-grey100">KICD Compliant</p>
                 </div>
               </div>
             </motion.div>

             <motion.div 
               animate={{ y: [0, 20, 0] }}
               transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute -left-8 bottom-32 bg-grey900 p-4 rounded-2xl border border-grey700 shadow-xl z-20"
             >
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/20 rounded-lg">
                   <Clock className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <p className="text-xs text-grey400">Time Saved</p>
                   <p className="text-sm font-bold text-grey100">~12 Hours/Week</p>
                 </div>
               </div>
             </motion.div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* --- FEATURES SECTION (Bento Grid) --- */}
      <section className="w-full py-24 md:py-32 relative">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="mb-20 md:text-center max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-grey100 mb-6">
              Everything You Need to <span className="text-primary">Plan Better</span>
            </h2>
            <p className="font-paragraph text-lg text-grey400">
              Generate professional teaching materials in minutes, not hours. Our tools are specifically calibrated for the Kenyan CBC curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES_DATA.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Horizontal Scroll / Steps) --- */}
      <section className="w-full py-24 bg-grey900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-grey700 to-transparent" />
        
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Sticky Title */}
            <div className="lg:w-1/3 lg:sticky lg:top-32">
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-grey100 mb-8">
                How It Works
              </h2>
              <p className="font-paragraph text-xl text-grey400 mb-12">
                From prompt to printable document in four simple steps. Designed for teachers who want to focus on teaching, not paperwork.
              </p>
              <Link to="/how-it-works">
                <Button variant="outline" className="group border-primary text-primary hover:bg-primary hover:text-background rounded-full px-8">
                  Start Tutorial
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Steps List */}
            <div className="lg:w-2/3 grid gap-8">
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <StepCard key={step.step} step={step} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- BENEFITS SECTION (Parallax Image & Content) --- */}
      <section className="w-full py-32 relative">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Content Side */}
            <div className="order-2 lg:order-1 space-y-16">
              <div className="space-y-6">
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-grey100">
                  Why Choose EduRipple?
                </h2>
                <p className="font-paragraph text-lg text-grey400">
                  We understand the unique challenges of the CBC implementation. Our platform is built to bridge the gap between curriculum requirements and classroom reality.
                </p>
              </div>

              <div className="space-y-12">
                {BENEFITS_DATA.map((benefit, index) => (
                  <BenefitItem key={benefit.id} benefit={benefit} index={index} />
                ))}
              </div>
            </div>

            {/* Image Side - Sticky & Parallax */}
            <div className="order-1 lg:order-2 relative h-[600px] lg:h-[800px] w-full rounded-3xl overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 z-10" />
               <Image 
                 src="https://static.wixstatic.com/media/93a3ae_c4a41da2e36546729f405d312a70d532~mv2.png?originWidth=1152&originHeight=768"
                 alt="Teacher using EduRipple in a classroom setting"
                 className="w-full h-full object-cover"
               />
               
               {/* Overlay Card */}
               <div className="absolute bottom-12 left-6 right-6 md:left-12 md:right-12 z-20 bg-grey900/90 backdrop-blur-md p-8 rounded-2xl border border-grey700">
                 <div className="flex items-start gap-4">
                   <div className="p-3 bg-primary/20 rounded-full">
                     <Brain className="w-6 h-6 text-primary" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-grey100 mb-2">Teacher-Centric Design</h3>
                     <p className="text-grey400 text-sm">"EduRipple has transformed how I prepare for my Grade 7 classes. The lesson plans are detailed and spot-on."</p>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="w-full py-32 relative overflow-hidden">
        {/* Background Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-grey900 via-background to-grey900" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
           <div className="absolute -top-[50%] -left-[20%] w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[100px]" />
           <div className="absolute -bottom-[50%] -right-[20%] w-[1000px] h-[1000px] bg-secondary/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-6xl font-bold text-grey100 mb-8"
          >
            Ready to Transform Your Teaching?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-paragraph text-xl text-grey400 mb-12 max-w-2xl mx-auto"
          >
            Join thousands of Kenyan teachers who are already using EduRipple to create better learning experiences and reclaim their time.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link to="/ai-chat">
              <Button className="w-full sm:w-auto bg-primary text-background hover:bg-primary/90 h-16 px-10 text-xl font-bold rounded-full shadow-lg shadow-primary/20">
                Get Started Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" className="w-full sm:w-auto text-grey300 hover:text-white hover:bg-grey800 h-16 px-10 text-xl font-medium rounded-full">
                Contact Support
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FeatureCard({ feature, index }: { feature: typeof FEATURES_DATA[0], index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-grey900/50 backdrop-blur-sm border border-grey800 p-8 rounded-2xl hover:border-primary/50 transition-colors duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="w-14 h-14 bg-grey800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/20">
          <feature.icon className="w-7 h-7 text-primary" />
        </div>
        
        <h3 className="font-heading text-xl font-bold text-grey100 mb-3 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>
        
        <p className="font-paragraph text-grey400 mb-4 leading-relaxed">
          {feature.description}
        </p>

        <div className="h-px w-full bg-grey800 my-4" />
        
        <p className="text-sm text-grey500 italic">
          {feature.detail}
        </p>
      </div>
    </motion.div>
  );
}

function StepCard({ step, index }: { step: typeof HOW_IT_WORKS_STEPS[0], index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex gap-6 items-start group"
    >
      <div className="flex-shrink-0 relative">
        <div className="w-16 h-16 rounded-2xl bg-grey800 border border-grey700 flex items-center justify-center group-hover:border-primary transition-colors duration-300 z-10 relative">
          <span className="font-heading text-2xl font-bold text-grey400 group-hover:text-primary transition-colors">0{step.step}</span>
        </div>
        {index !== HOW_IT_WORKS_STEPS.length - 1 && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-px h-24 bg-grey800 group-hover:bg-primary/30 transition-colors delay-100" />
        )}
      </div>
      
      <div className="pt-2 pb-12">
        <h3 className="font-heading text-2xl font-bold text-grey100 mb-2 flex items-center gap-3">
          {step.title}
          <step.icon className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300" />
        </h3>
        <p className="font-paragraph text-lg text-grey400">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

function BenefitItem({ benefit, index }: { benefit: typeof BENEFITS_DATA[0], index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex gap-6"
    >
      <div className="flex-shrink-0 mt-1">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <benefit.icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div>
        <h3 className="font-heading text-xl font-bold text-grey100 mb-2">
          {benefit.title}
        </h3>
        <p className="font-paragraph text-grey400 leading-relaxed">
          {benefit.description}
        </p>
      </div>
    </motion.div>
  );
}
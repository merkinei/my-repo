import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { ExamplePrompts } from '@/entities';

export default function AIChatPage() {
  const [prompt, setPrompt] = useState('');
  const [examplePrompts, setExamplePrompts] = useState<ExamplePrompts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    loadExamplePrompts();
  }, []);

  const loadExamplePrompts = async () => {
    try {
      const result = await BaseCrudService.getAll<ExamplePrompts>('exampleprompts');
      setExamplePrompts(result.items);
    } catch (error) {
      console.error('Error loading example prompts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsSending(true);
    setResponse(null);
    
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() })
      });

      const data = await res.json();
      
      if (data.success && data.response) {
        setResponse(data.response);
      } else {
        setResponse(`Error: ${data.error || 'Failed to generate response'}`);
      }
    } catch (error) {
      console.error('Error sending prompt:', error);
      setResponse('Error: Failed to connect to the AI service. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleExampleClick = (exampleText: string) => {
    setPrompt(exampleText);
    setResponse(null);
  };

  const featuredPrompts = examplePrompts.filter(p => p.isFeatured);
  const regularPrompts = examplePrompts.filter(p => !p.isFeatured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-6 py-16">
        <div className="max-w-[100rem] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-grey900 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm text-grey300">AI-Powered Teaching Assistant</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl mb-6 text-grey100">
              Generate CBC Teaching Materials
            </h1>
            <p className="font-paragraph text-lg text-grey400 max-w-2xl mx-auto">
              Enter your prompt below to create lesson plans, schemes of work, assessments, and more
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Chat Interface */}
      <section className="w-full pb-24">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Example Prompts Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-grey900 p-6 rounded-lg sticky top-24"
              >
                <h2 className="font-heading text-xl mb-6 text-grey100">Example Prompts</h2>
                
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 bg-grey800 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {featuredPrompts.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-paragraph text-sm text-primary font-bold mb-3">Featured</h3>
                        <div className="space-y-3">
                          {featuredPrompts.map((example) => (
                            <button
                              key={example._id}
                              onClick={() => handleExampleClick(example.promptText || '')}
                              className="w-full text-left bg-background p-4 rounded-lg hover:bg-grey800 transition-colors"
                            >
                              <p className="font-paragraph text-sm text-grey300 mb-2">
                                {example.promptText}
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {example.subject && (
                                  <span className="text-xs text-grey500 bg-grey900 px-2 py-1 rounded">
                                    {example.subject}
                                  </span>
                                )}
                                {example.targetGrade && (
                                  <span className="text-xs text-grey500 bg-grey900 px-2 py-1 rounded">
                                    {example.targetGrade}
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {regularPrompts.length > 0 && (
                      <div>
                        <h3 className="font-paragraph text-sm text-grey400 font-bold mb-3">More Examples</h3>
                        <div className="space-y-3">
                          {regularPrompts.slice(0, 5).map((example) => (
                            <button
                              key={example._id}
                              onClick={() => handleExampleClick(example.promptText || '')}
                              className="w-full text-left bg-background p-4 rounded-lg hover:bg-grey800 transition-colors"
                            >
                              <p className="font-paragraph text-sm text-grey300 mb-2">
                                {example.promptText}
                              </p>
                              {example.category && (
                                <span className="text-xs text-grey500 bg-grey900 px-2 py-1 rounded">
                                  {example.category}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-grey800">
                  <h3 className="font-paragraph text-sm text-grey400 font-bold mb-3">Tips</h3>
                  <ul className="space-y-2 font-paragraph text-xs text-grey500">
                    <li>• Be specific about grade level and subject</li>
                    <li>• Mention the strand or sub-strand</li>
                    <li>• Include learning outcomes if needed</li>
                    <li>• Specify the term or duration</li>
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-grey900 p-8 rounded-lg"
              >
                {/* Prompt Input */}
                <div className="mb-6">
                  <label className="font-paragraph text-sm text-grey400 mb-3 block">
                    Enter your prompt
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: Generate a Grade 7 English lesson plan on Reading Comprehension for Term 1, Week 3"
                    className="min-h-[200px] bg-background border-grey800 text-grey100 font-paragraph text-base resize-none focus:border-primary"
                    disabled={isSending}
                  />
                </div>

                <Button
                  onClick={handleSendPrompt}
                  disabled={!prompt.trim() || isSending}
                  className="bg-primary text-primary-foreground hover:opacity-90 px-8 py-4 font-bold rounded-lg w-full md:w-auto inline-flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Generate Materials
                    </>
                  )}
                </Button>

                {/* Response Area */}
                {response && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-8 pt-8 border-t border-grey800"
                  >
                    <h3 className="font-heading text-xl mb-4 text-grey100 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Response
                    </h3>
                    <div className="bg-background p-6 rounded-lg">
                      <p className="font-paragraph text-base text-grey300 leading-relaxed">
                        {response}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Info Box */}
                {!response && (
                  <div className="mt-8 bg-background p-6 rounded-lg border border-grey800">
                    <h3 className="font-heading text-lg mb-3 text-grey100">Backend Ready</h3>
                    <p className="font-paragraph text-sm text-grey400">
                      The API endpoint is now active at <code className="bg-grey900 px-2 py-1 rounded text-primary">/api/ai-chat</code>. Connect your AI service to start generating CBC-aligned teaching materials.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

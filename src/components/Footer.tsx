import { Link } from 'react-router-dom';
import { Mail, Twitter, Facebook, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-grey900 border-t border-grey800">
      <div className="max-w-[100rem] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">E</span>
              </div>
              <span className="font-heading text-2xl font-bold text-grey100">EduRipple</span>
            </div>
            <p className="font-paragraph text-sm text-grey400">
              AI-powered teaching assistant for Kenyan CBC educators
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold text-grey100 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="font-paragraph text-sm text-grey400 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="font-paragraph text-sm text-grey400 hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="font-paragraph text-sm text-grey400 hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/ai-chat" className="font-paragraph text-sm text-grey400 hover:text-primary transition-colors">
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading text-lg font-bold text-grey100 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="font-paragraph text-sm text-grey400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="font-paragraph text-sm text-grey400 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-lg font-bold text-grey100 mb-4">Connect</h3>
            <div className="space-y-3 mb-6">
              <a href="mailto:info@eduripple.co.ke" className="flex items-center gap-2 font-paragraph text-sm text-grey400 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                info@eduripple.co.ke
              </a>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-grey800 rounded-lg flex items-center justify-center text-grey400 hover:text-primary hover:bg-grey700 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-grey800 rounded-lg flex items-center justify-center text-grey400 hover:text-primary hover:bg-grey700 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-grey800 rounded-lg flex items-center justify-center text-grey400 hover:text-primary hover:bg-grey700 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-grey800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-grey500">
              © {currentYear} EduRipple. All rights reserved.
            </p>
            <p className="font-paragraph text-sm text-grey500">
              Built for Kenyan educators, with care
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

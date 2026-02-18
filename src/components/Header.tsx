import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/ai-chat', label: 'AI Assistant' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-background border-b border-grey800 sticky top-0 z-50">
      <div className="max-w-[100rem] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Image 
              src="https://static.wixstatic.com/media/93a3ae_d01325e4697b4dd781b3bb85b687c7c0~mv2.png" 
              alt="EduRipple Logo" 
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-paragraph text-base transition-colors ${
                  isActive(link.path)
                    ? 'text-primary font-bold'
                    : 'text-grey400 hover:text-grey100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link to="/ai-chat">
              <Button className="bg-primary text-primary-foreground hover:opacity-90 px-6 py-3 font-bold rounded-lg">
                Try EduRipple AI
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-grey100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-6 pb-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-paragraph text-base py-2 transition-colors ${
                  isActive(link.path)
                    ? 'text-primary font-bold'
                    : 'text-grey400 hover:text-grey100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/ai-chat" onClick={() => setMobileMenuOpen(false)}>
              <Button className="bg-primary text-primary-foreground hover:opacity-90 w-full px-6 py-3 font-bold rounded-lg mt-2">
                Try EduRipple AI
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card border-t border-white/10 mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-text">LearnMate</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Empowering learners with AI-powered educational tools for better understanding and productivity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/simplify" className="hover:text-primary transition-colors">Text Simplifier</a></li>
              <li><a href="/planner" className="hover:text-primary transition-colors">Study Planner</a></li>
              <li><a href="/chat" className="hover:text-primary transition-colors">AI Chat</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest updates on new features and AI learning tools.
            </p>
            <div className="flex space-x-2">
              <Input 
                placeholder="Enter your email" 
                className="bg-white/5 border-white/20 text-sm"
              />
              <Button size="sm" className="glass-button">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 LearnMate. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
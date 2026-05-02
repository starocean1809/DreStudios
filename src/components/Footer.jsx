import React from 'react';
import { MessageCircle, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 glass border-t border-white/50">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16">
        {/* About */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-bold text-foreground text-base mb-2">About Dre Studios</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            Dre Studios crafts premium 3D-printed products — from art and home décor to functional tools and fashion accessories. Every piece is printed with care and precision.
          </p>
        </div>

        {/* Social */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <h3 className="font-bold text-foreground text-base">Connect</h3>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-green-500 transition-colors group"
          >
            <span className="w-8 h-8 rounded-xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">
              <MessageCircle size={16} className="text-green-500" />
            </span>
            WhatsApp
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-pink-500 transition-colors group"
          >
            <span className="w-8 h-8 rounded-xl bg-pink-50 group-hover:bg-pink-100 flex items-center justify-center transition-colors">
              <Instagram size={16} className="text-pink-500" />
            </span>
            Instagram
          </a>
        </div>
      </div>

      <div className="border-t border-white/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Dre Studios · Crafted with precision
      </div>
    </footer>
  );
}

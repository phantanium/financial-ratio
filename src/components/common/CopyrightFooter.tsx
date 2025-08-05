// src/components/common/CopyrightFooter.tsx
import { Heart, HeartCrack, Wrench } from "lucide-react";

export default function CopyrightFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card border-t border-border py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>© {currentYear} Indonesian Finance Dashboard</span>
          </div>
          
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Wrench className="w-4 h-4 text-red-500 fill-current" />
            <span>by</span>
            <a 
              href="https://www.linkedin.com/in/naufal-fatihul" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Naufal Fatihul Rizky
            </a>
            <span>•</span>
            <span className="font-medium">Accounting '62</span>
            <span>•</span>
            <a 
              href="https://ipb.ac.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              IPB University
            </a>
          </div>
        </div>
        
        {/* Additional info */}
        <div className="text-center text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
          <p>Financial data sourced from Yahoo Finance • Built for educational purposes • Tapak Wiyata IPB Project</p>
        </div>
      </div>
    </footer>
  );
}
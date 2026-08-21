import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Only use white text on the home page when not scrolled (dark hero behind navbar)
  const isHomePage = location === "/";
  const useDarkText = isScrolled || !isHomePage;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Collection", path: "/shoes" },
    { label: "Gallery", path: "/gallery" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" }
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] transition-all duration-500 border-b border-transparent",
          useDarkText
            ? "bg-background/95 backdrop-blur-xl border-border shadow-sm py-3 md:py-4"
            : "bg-gradient-to-b from-black/60 to-transparent py-5 md:py-8"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className={cn(
              "font-display font-black text-2xl md:text-3xl tracking-tighter uppercase italic transition-colors duration-300",
              useDarkText ? "text-black group-hover:text-accent" : "text-white group-hover:text-accent"
            )}>
              Ozy<span className={cn(
                "transition-colors duration-300",
                useDarkText ? "text-accent group-hover:text-black" : "text-accent group-hover:text-white"
              )}>Sneakers</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "text-sm font-bold tracking-widest uppercase transition-colors duration-300 relative py-2 hover:text-accent",
                  location === link.path
                    ? "text-accent"
                    : useDarkText ? "text-black" : "text-white"
                )}
              >
                {link.label}
                {location === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />
                )}
              </Link>
            ))}
          </nav>

          {/* Hamburger — mobile only */}
          <button
            className={cn(
              "md:hidden flex items-center justify-center w-11 h-11 transition-colors duration-300 hover:text-accent focus:outline-none",
              useDarkText ? "text-black" : "text-white"
            )}
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu — rendered outside header so it sits below it cleanly */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed top-[56px] left-0 right-0 z-[59] bg-background border-b border-border shadow-2xl md:hidden"
          >
            <nav className="container mx-auto px-6 py-4 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "font-display font-black text-xl uppercase italic tracking-widest py-4 border-b border-border/50 last:border-0 transition-colors",
                    location === link.path ? "text-accent" : "text-foreground hover:text-accent"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

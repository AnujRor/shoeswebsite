import { Link } from "wouter";
import heroBg from "@assets/file_000000003a8481faa411ec2156d92906_1784783072991.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Collection", path: "/shoes" },
  { label: "Gallery", path: "/gallery" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const WHATSAPP_NUMBER = "917900051580";
const INSTAGRAM_USER = "Ozy_sneakers1223";
const MAPS_URL = "https://maps.app.goo.gl/o6bLhxxsyr9JjLQ99";

const connectLinks = [
  { label: "WhatsApp", href: `https://wa.me/${WHATSAPP_NUMBER}` },
  { label: "Instagram", href: `https://www.instagram.com/${INSTAGRAM_USER}` },
  { label: "Location", href: MAPS_URL },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground pt-14 md:pt-24 pb-10 md:pb-12">
      {/* Background image with dark overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.96) 100%)",
        }}
      />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <span className="font-display font-black text-3xl md:text-4xl tracking-tighter uppercase italic text-primary-foreground group-hover:text-accent transition-colors duration-300 whitespace-nowrap">
                Ozy<span className="text-accent">Sneakers</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-lg leading-relaxed font-medium">
              Premium sports sneakers for athletes and enthusiasts.
              Built for speed. Designed for the streets.
            </p>
          </div>

          {/* Nav Links */}
          <div>
            <h3 className="font-bold uppercase tracking-widest text-xs mb-6 text-primary-foreground/50">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="font-bold uppercase tracking-widest text-sm text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h3 className="font-bold uppercase tracking-widest text-xs mb-6 text-primary-foreground/50">
              Connect
            </h3>
            <ul className="flex flex-col gap-4">
              {connectLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold uppercase tracking-widest text-sm text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-primary-foreground/50 font-mono text-sm uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Ozy Sneakers. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-primary-foreground/50 font-mono text-sm uppercase tracking-widest">Live</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

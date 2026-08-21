import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ChatBot } from "../ChatBot";
import { ReactNode } from "react";

const WHATSAPP_NUMBER = "917900051580"; // +91 79000-51580
const INSTAGRAM_USER = "Ozy_sneakers1223";
const MAPS_URL = "https://maps.app.goo.gl/o6bLhxxsyr9JjLQ99";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-[100dvh] overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />

      {/* Floating Side Icons */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-[3px]">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp"
          className="flex items-center gap-3 px-2 sm:px-3 h-10 sm:h-12 bg-[#25D366] hover:brightness-110 transition-all duration-200"
          style={{ borderRadius: "8px 0 0 8px" }}
        >
          <svg className="flex-shrink-0 w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.126 1.533 5.862L.057 23.571a.5.5 0 0 0 .612.612l5.709-1.476A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.182-1.432l-.372-.22-3.888 1.005 1.025-3.764-.242-.388A9.961 9.961 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
        </a>

        {/* Instagram */}
        <a
          href={`https://www.instagram.com/${INSTAGRAM_USER}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Follow on Instagram"
          className="flex items-center gap-3 px-2 sm:px-3 h-10 sm:h-12 hover:brightness-110 transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            borderRadius: "8px 0 0 8px",
          }}
        >
          <svg className="flex-shrink-0 w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>

        {/* Location */}
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Find us on Google Maps"
          className="flex items-center gap-3 px-2 sm:px-3 h-10 sm:h-12 bg-[#EA4335] hover:brightness-110 transition-all duration-200"
          style={{ borderRadius: "8px 0 0 8px" }}
        >
          <svg className="flex-shrink-0 w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
          </svg>
        </a>
      </div>

      <ChatBot />
    </div>
  );
}

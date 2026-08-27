import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroBg from "@assets/file_000000003a8481faa411ec2156d92906_1784783072991.png";

// Brand images
import jordan1 from "@assets/1000058838_1785227387159.jpg";
import jordan2 from "@assets/1000058824_1785227387161.jpg";
import jordan3 from "@assets/1000058799_1785227387168.jpg";
import jordan4 from "@assets/1000058805_1785227387170.jpg";
import jordan5 from "@assets/1000058802_1785227387171.jpg";
import jordan6 from "@assets/1000058808_1785227387177.jpg";
import jordan7 from "@assets/1000058838_1785228477266.jpg";
import jordan8 from "@assets/1000058859_1785228477275.jpg";
import jordanNew from "@assets/jordan_1.jpg";
import lv1 from "@assets/1000058820_1785227387165.jpg";
import lv2 from "@assets/1000058817_1785227387167.jpg";
import lv3 from "@assets/1000058796_1785227387175.jpg";
import lv4 from "@assets/1000058844_1785228477268.jpg";
import lv5 from "@assets/1000058850_1785228477269.jpg";
import nikeImg from "@assets/1000058811_1785227387173.jpg";
import nike2 from "@assets/1000058862_1785228477274.jpg";
import nike3 from "@assets/1000058853_1785228477277.jpg";
import nike4 from "@assets/1000058856_1785228477279.jpg";
import nikeNew from "@assets/nike_new.jpg";
import nbImg from "@assets/1000058814_1785227387174.jpg";
import nb2 from "@assets/1000058847_1785228477272.jpg";
import oniImg from "@assets/1000058832_1785227387164.jpg";
import oni2 from "@assets/1000058841_1785228477270.jpg";

const brandSections = [
  {
    brand: "Jordan",
    images: [jordanNew, jordan2, jordan3, jordan4, jordan5, jordan6, jordan7, jordan8],
  },
  {
    brand: "Louis Vuitton",
    images: [lv1, lv2, lv3, lv4, lv5],
  },
  {
    brand: "Nike",
    images: [nikeImg, nike2, nike3, nike4],
  },
  {
    brand: "New Balance",
    images: [nbImg, nb2],
  },
  {
    brand: "Onitsuka Tiger",
    images: [oniImg, oni2],
  },
];


export default function ShoesCategory() {
  const [query, setQuery] = useState("");

  const filtered = brandSections.filter((s) =>
    s.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner */}
      <section className="relative h-[45vh] min-h-[300px] w-full flex items-end bg-black overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundPosition: "top center",
            backgroundSize: "cover",
          }}
        />
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to top, black 30%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.15) 100%)",
          }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-20 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="text-accent font-mono font-bold tracking-widest uppercase mb-3 block border-l-4 border-accent pl-4 text-sm">
              Ozy Sneakers
            </span>
            <h1 className="font-display text-[3rem] sm:text-[4rem] md:text-[5rem] font-black uppercase italic text-white leading-[0.85] tracking-tighter">
              Our<br />Collection
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="container mx-auto px-4 md:px-6 pt-12 pb-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-xl mx-auto"
        >
          {/* Search icon */}
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by brand — Jordan, Nike, LV…"
            className="w-full bg-secondary/30 border border-border focus:border-accent outline-none rounded-none pl-12 pr-12 py-4 text-sm font-mono tracking-wide placeholder:text-muted-foreground transition-colors duration-200"
          />

          {/* Clear button */}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </motion.div>

        {/* No results message */}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-sm mt-10 font-mono tracking-wider uppercase">
            No brands found for &quot;{query}&quot;
          </p>
        )}
      </div>

      {/* Brand Sections */}
      <div className="container mx-auto px-4 md:px-6 pb-24 space-y-20 mt-10">
        <AnimatePresence>
        {filtered.map((section, sIdx) => (
          <motion.div
            key={section.brand}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Brand Header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-10"
            >
              <span className="w-1 h-10 bg-accent inline-block" />
              <h2 className="font-display font-black text-4xl md:text-5xl uppercase italic tracking-tighter">
                {section.brand}
              </h2>
            </motion.div>

            {/* Brand Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
              {section.images.map((img, iIdx) => (
                <motion.div
                  key={iIdx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: iIdx * 0.08 }}
                  className="group"
                >
                  <div className="relative bg-secondary/20 aspect-square overflow-hidden border border-transparent group-hover:border-accent transition-colors duration-300">
                    <img
                      src={img}
                      alt={`${section.brand} ${iIdx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <div className="mt-3">
                    <span className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
                      {section.brand}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {sIdx < filtered.length - 1 && (
              <div className="mt-20 border-t border-border" />
            )}
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

// ─── ADD YOUR IMAGES HERE ───────────────────────────────────────────────────
// Sirf image ka path likho. New image add karni ho to:
//  1. File ko attached_assets/ folder mein daalo
//  2. Neeche import karo (jaise existing imports)
//  3. galleryItems array mein { type: "image", src: variable } add karo

// Images
import img11 from "@assets/1000058282_1784972900632.jpg";
import img12 from "@assets/1000058284_1784972900635.jpg";
import img13 from "@assets/1000058290_1784972900636.jpg";
import img14 from "@assets/1000057604_1784972900638.jpg";
import img15 from "@assets/1000057602_1784972900639.jpg";
import img16 from "@assets/1000057606_1784972900640.jpg";
import img17 from "@assets/1000058286_1784972900643.jpg";
import img18 from "@assets/1000058280_1784972900645.jpg";
import img19 from "@assets/1000058272_1784972900647.jpg";
import img20 from "@assets/1000058274_1784972900649.jpg";
import img21 from "@assets/1000058270_1784972900651.jpg";
import img22 from "@assets/1000058262_1784972900652.jpg";
import img23 from "@assets/1000058268_1784972900653.jpg";
import img24 from "@assets/1000058264_1784972900655.jpg";
import img25 from "@assets/1000058276_1784972900656.jpg";
import img26 from "@assets/1000058260_1784972900658.jpg";
import img27 from "@assets/1000058288_1784973470349.jpg";
import img28 from "@assets/1000058302_1784973470350.jpg";
import img29 from "@assets/1000058294_1784973470352.jpg";
import img30 from "@assets/1000058296_1784973470353.jpg";
import img31 from "@assets/1000058300_1784973470355.jpg";
import img32 from "@assets/1000058292_1784973470356.jpg";
import img33 from "@assets/1000058306_1784973470358.jpg";
import img34 from "@assets/1000058298_1784973470359.jpg";
import img35 from "@assets/1000058304_1784973470361.jpg";

// ─── ADD YOUR VIDEOS HERE ────────────────────────────────────────────────────
// Video add karni ho to:
//  1. Video file ko attached_assets/ folder mein daalo
//  2. Neeche import karo
//  3. galleryItems array mein { type: "video", src: variable } add karo

const galleryItems: { type: "image" | "video"; src: string }[] = [
  { type: "image", src: img11 },
  { type: "image", src: img12 },
  { type: "image", src: img13 },
  { type: "image", src: img14 },
  { type: "image", src: img15 },
  { type: "image", src: img16 },
  { type: "image", src: img17 },
  { type: "image", src: img18 },
  { type: "image", src: img19 },
  { type: "image", src: img20 },
  { type: "image", src: img21 },
  { type: "image", src: img22 },
  { type: "image", src: img23 },
  { type: "image", src: img24 },
  { type: "image", src: img25 },
  { type: "image", src: img26 },
  { type: "image", src: img27 },
  { type: "image", src: img28 },
  { type: "image", src: img29 },
  { type: "image", src: img30 },
  { type: "image", src: img31 },
  { type: "image", src: img32 },
  { type: "image", src: img33 },
  { type: "image", src: img34 },
  { type: "image", src: img35 },
  // { type: "video", src: myVideo },   ← Video example
];
// ─────────────────────────────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: "easeOut" as const },
  }),
};

export default function Gallery() {
  return (
    <div className="flex flex-col w-full">
      {/* SEO */}
      <Helmet>
        <title>Naye Shoes Design Dekho – Ozy Sneakers Pundri</title>
        <meta name="title" content="Naye Shoes Design Dekho – Ozy Sneakers Pundri" />
        <meta name="description" content="New shoes aur latest design dekhne ke liye Ozy Sneakers ki gallery dekho. Naya stock aata rehta hai Pundri, Kaithal ki dukan mein." />
        <meta name="keywords" content="naye shoes design, latest shoes 2026, new sneakers, shoe design dekhna" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-black" />
        {/* Radial glow — orange center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,90,0,0.22) 0%, rgba(255,90,0,0.06) 45%, transparent 70%)",
          }}
        />
        {/* Top-left accent stripe */}
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{ background: "linear-gradient(to right, #ff5a00, transparent)" }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Big faded text behind */}
        <span
          className="absolute select-none font-display font-black uppercase italic tracking-tighter text-white pointer-events-none"
          style={{
            fontSize: "clamp(80px, 18vw, 220px)",
            opacity: 0.04,
            whiteSpace: "nowrap",
          }}
        >
          GALLERY
        </span>
        {/* Bottom fade to page bg */}
        <div
          className="absolute bottom-0 left-0 w-full h-20"
          style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--background)))" }}
        />

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 text-center px-4"
        >
          <span className="text-accent font-mono font-bold tracking-widest uppercase text-sm mb-5 block">
            Our Collection
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black uppercase italic tracking-tighter mb-5 leading-none text-white">
            Ozy <span className="text-accent">Gallery</span>
          </h1>
          <p className="text-lg text-white/60 font-medium leading-relaxed max-w-xl mx-auto">
            Exclusive drops, style shots, and behind-the-scenes moments.
          </p>
        </motion.div>
      </section>

      {/* Grid Section */}
      <div className="container mx-auto px-4 md:px-6 py-16">

      {/* Grid */}
      {galleryItems.length === 0 ? (
        <div className="text-center py-32 text-muted-foreground">
          <p className="text-2xl font-display font-black uppercase italic">Gallery coming soon</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="break-inside-avoid overflow-hidden group relative bg-secondary/20"
            >
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={`Shoe design ${i + 1} - Ozy Sneakers Pundri Kaithal`}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <video
                  src={item.src}
                  className="w-full h-auto object-cover"
                  controls
                  playsInline
                  preload="metadata"
                />
              )}
              {/* Hover overlay */}
              {item.type === "image" && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </motion.div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

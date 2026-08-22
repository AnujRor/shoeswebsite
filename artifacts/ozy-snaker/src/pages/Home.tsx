import { useListProducts, useListFeaturedProducts, useListNewArrivals, useListBestSellers, useGetStoreStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useMemo, useState, useEffect, useRef, type CSSProperties } from "react";

// The Classics slideshow images
import classics1 from "@assets/1000058847_1785229670276.jpg";
import classics2 from "@assets/1000058862_1785229670278.jpg";
import classics3 from "@assets/1000058859_1785229670280.jpg";
import classics4 from "@assets/1000058853_1785229670281.jpg";
import classics5 from "@assets/1000058856_1785229670283.jpg";

const classicsImages = [classics1, classics2, classics3, classics4, classics5];

// Time-based showcase slideshow images
import timeBg1 from "@assets/Gemini_Generated_Image_5kyzzp5kyzzp5kyz_1786044429873.png";
import timeBg2 from "@assets/Gemini_Generated_Image_itzb7litzb7litzb_1786044445286.png";
import timeBg3 from "@assets/Gemini_Generated_Image_imaaudimaaudimaa_1786044455707.png";

const hotDropImages = [timeBg1, timeBg2, timeBg3];

const customerReviews = [
  {
    name: "Amandeep Singh",
    review: "Amazing collection and the shoes feel exactly like premium sneakers should.",
  },
  {
    name: "Rohit Kumar",
    review: "Original products, quick service, and the fit was perfect. Highly recommended.",
  },
  {
    name: "Neha Sharma",
    review: "OZY Sneakers has become my go-to place for fresh and stylish kicks.",
  },
];

// Image imports
import heroBg from "@assets/file_000000003a8481faa411ec2156d92906_1784783072991.png";
import statsBg from "@assets/image_1784883327092.png";
import catRunning from "@assets/generated_images/cat-running.jpg";
import catBasketball from "@assets/generated_images/cat-basketball.jpg";
import catLifestyle from "@assets/generated_images/cat-lifestyle.jpg";
import catTraining from "@assets/generated_images/cat-training.jpg";
import product1 from "@assets/generated_images/product-1.png";
import product2 from "@assets/generated_images/product-2.png";
import product3 from "@assets/generated_images/product-3.png";

function AnimatedStatValue({
  value,
  suffix,
  delay,
}: {
  value: number;
  suffix: string;
  delay: number;
}) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(valueRef, { once: true, amount: 0.6 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1100;
    const startTime = performance.now();
    let frameId = 0;

    const animateValue = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * easedProgress));

      if (progress < 1) {
        frameId = requestAnimationFrame(animateValue);
      }
    };

    frameId = requestAnimationFrame(animateValue);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, value]);

  return (
    <motion.span
      ref={valueRef}
      initial={{ opacity: 0, y: 18, scale: 0.86 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.65, delay: delay + 0.1, ease: "easeOut" }}
      className="text-4xl md:text-6xl font-display font-black text-white leading-none mb-3"
    >
      {displayValue}
      {suffix}
    </motion.span>
  );
}

export default function Home() {
  const { data: featuredProducts } = useListFeaturedProducts();
  const { data: newArrivals } = useListNewArrivals();
  const { data: bestSellers } = useListBestSellers();
  const { data: stats } = useGetStoreStats();

  const fallbacks = [product1, product2, product3];

  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % hotDropImages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const timeSlot = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { 
        title: "Start Your Morning Right", 
        desc: "Featured running and training gear.",
        categories: ["running", "training"],
        data: featuredProducts,
      };
    }
    if (hour >= 12 && hour < 17) {
      return { 
        title: "Afternoon Energy", 
        desc: "Basketball and lifestyle essentials.",
        categories: ["basketball", "lifestyle"],
        data: bestSellers,
      };
    }
    if (hour >= 17 && hour < 22) {
      return { 
        title: "Evening Style", 
        desc: "Premium lifestyle curations.",
        categories: ["lifestyle"],
        data: featuredProducts,
      };
    }
    return { 
      title: "Hot Drop", 
      desc: "New arrivals and limited editions.",
      categories: ["all"],
      data: newArrivals,
    };
  }, [featuredProducts, newArrivals, bestSellers]);

  const timeBasedProducts = useMemo(() => {
    if (!timeSlot.data) return [];
    if (timeSlot.categories.includes("all")) return timeSlot.data.slice(0, 4);
    
    return timeSlot.data
      .filter(p => timeSlot.categories.includes(p.category.toLowerCase()))
      .slice(0, 4);
  }, [timeSlot]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[95vh] min-h-[600px] w-full flex items-end bg-black overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundImage: `url(${heroBg})`, 
            backgroundPosition: 'top center', 
            backgroundSize: 'cover' 
          }}
        />
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, black 35%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.15) 100%)' }} />
        
        <div className="container mx-auto px-4 md:px-6 relative z-20 pb-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl pr-14 sm:pr-6 md:pr-0"
          >
            <span className="text-accent font-mono font-bold tracking-widest uppercase mb-6 block border-l-4 border-accent pl-4">
              The Next Evolution
            </span>
            <h1 className="font-display text-[2rem] sm:text-[3.5rem] md:text-[5.5rem] lg:text-[7rem] font-black uppercase italic text-white leading-[0.85] mb-8 tracking-tighter">
              OZY<br/>SNEAKERS
            </h1>
            <p className="text-gray-300 text-base sm:text-xl md:text-2xl max-w-2xl font-medium leading-relaxed">
              Step Into Style – Ozy Sneakers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-white text-black py-6 border-y-8 border-black overflow-hidden relative z-30">
        <div className="marquee-container">
          <div className="marquee-content font-display font-black text-xl md:text-3xl uppercase tracking-widest italic flex gap-8 md:gap-12">
            <span>Ozy Snaker</span>
            <span>//</span>
            <span>Unmatched Speed</span>
            <span>//</span>
            <span>Street Ready</span>
            <span>//</span>
            <span>Electric Energy</span>
            <span>//</span>
            <span>Ozy Snaker</span>
            <span>//</span>
            <span>Unmatched Speed</span>
            <span>//</span>
            <span>Street Ready</span>
            <span>//</span>
            <span>Electric Energy</span>
          </div>
        </div>
      </div>

      {/* Time-Based Showcase */}
      <section className="py-24 md:py-40 relative overflow-hidden">
        {/* Looping image slideshow background */}
        <AnimatePresence mode="sync">
          <motion.div
            key={slideIndex}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              backgroundImage: `url(${hotDropImages[slideIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 z-0 bg-black/60" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
        >
          <div>
            <span className="font-mono font-bold tracking-widest uppercase mb-4 block text-accent">
              Curated for Now
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-display font-black uppercase italic mb-4 tracking-tight text-white">
              {timeSlot.title}
            </h2>
            <p className="text-2xl font-medium text-white/80">
              {timeSlot.desc}
            </p>
          </div>
          <Link href="/shoes" className="hidden md:flex items-center gap-3 font-display font-bold text-xl uppercase tracking-widest transition-colors text-white hover:text-accent">
            View Collection <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {timeBasedProducts.length > 0 ? timeBasedProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <ProductCard 
                product={product} 
                imageFallback={fallbacks[idx % fallbacks.length]}
              />
            </motion.div>
          )) : featuredProducts?.slice(0,4).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <ProductCard 
                product={product} 
                imageFallback={fallbacks[idx % fallbacks.length]}
              />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Link href="/shoes" className="inline-flex items-center gap-3 font-display font-bold text-xl uppercase tracking-widest border-b-2 border-primary pb-2 hover:text-accent hover:border-accent transition-colors">
            View Collection <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section
        className="py-16 border-y border-border relative overflow-hidden"
        style={{
          background: '#0a0a0a',
        }}
      >
        {/* Radial red glow from center */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 120% at 50% 50%, rgba(220,38,38,0.28) 0%, rgba(180,20,20,0.10) 40%, transparent 70%)',
        }} />
        {/* Subtle diagonal lines texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '18px 18px',
        }} />
        {/* Bottom edge glow accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.7) 30%, rgba(255,100,50,0.9) 50%, rgba(220,38,38,0.7) 70%, transparent)',
        }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.7) 30%, rgba(255,100,50,0.9) 50%, rgba(220,38,38,0.7) 70%, transparent)',
        }} />
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: 500, suffix: '+', label: 'Kicks Available', delay: 0 },
              { value: 10, suffix: '+', label: 'Top Brands', delay: 0.1 },
              { value: 10, suffix: '', label: 'Years of Passion', delay: 0.2 },
              { value: 100, suffix: '%', label: 'Authentic', delay: 0.3 },
            ].map(({ value, suffix, label, delay }) => (
              <motion.div
                key={label}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                transition={{ delay }}
                className="flex flex-col items-center justify-center text-center border border-white/20 bg-white/5 backdrop-blur-sm py-8 px-4"
              >
                <AnimatedStatValue value={value} suffix={suffix} delay={delay} />
                <span className="font-bold uppercase tracking-widest text-xs text-white/70">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Legacy / Best Sellers */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        {/* Looping infinite scroll strip as background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="flex gap-0 h-full"
            style={{
              animation: "classicsScroll 18s linear infinite",
              width: "max-content",
            }}
          >
            {[...classicsImages, ...classicsImages, ...classicsImages].map((img, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-full"
                style={{ width: "clamp(180px, 50vw, 384px)" }}
              >
                <img
                  src={img}
                  alt={`Classic ${(i % classicsImages.length) + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          {/* Dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-black/65" />
        </div>

        {/* Text content on top */}
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center"
          >
            <span className="text-accent font-mono font-bold tracking-widest uppercase mb-4 block">
              Iconic Status
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-display font-black uppercase italic mb-6 tracking-tighter text-white">The Classics</h2>
            <p className="text-2xl text-white/80 font-medium max-w-2xl mx-auto">
              All-time favorites that define the culture and never miss.
            </p>
          </motion.div>
        </div>

        <style>{`
          @keyframes classicsScroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(calc(-100% / 3)); }
          }
        `}</style>
      </section>

      {/* Google Maps Embed */}
      <section className="container mx-auto px-4 md:px-6 py-24 md:py-32">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        >
          <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-8 italic">
            Find <span className="text-accent">Us</span>
          </h2>
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?q=29.7636154,76.5649948&z=16&hl=en&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ozy Sneakers Shop Location"
            />
          </div>
          <a
            href="https://maps.app.goo.gl/o6bLhxxsyr9JjLQ99"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 mt-6 bg-primary text-primary-foreground px-8 py-4 font-display font-black uppercase tracking-widest text-lg hover:bg-accent transition-colors duration-300"
          >
            Get Directions
          </a>
        </motion.div>
      </section>

      {/* Customer Reviews */}
      <section id="reviews" className="relative overflow-hidden border-t border-border bg-[#0a0a0a] py-20 md:py-28">
        {/* Animated gradient background */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse 70% 90% at 50% 0%, rgba(220,38,38,0.15), transparent 70%)",
              "radial-gradient(ellipse 70% 90% at 30% 20%, rgba(220,38,38,0.2), transparent 70%)",
              "radial-gradient(ellipse 70% 90% at 70% 10%, rgba(220,38,38,0.15), transparent 70%)",
              "radial-gradient(ellipse 70% 90% at 50% 0%, rgba(220,38,38,0.15), transparent 70%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-accent/30"
              style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <motion.span
              className="mb-4 block font-mono font-bold uppercase tracking-widest text-accent"
              animate={{ textShadow: ["0 0 0px rgba(220,38,38,0)", "0 0 20px rgba(220,38,38,0.5)", "0 0 0px rgba(220,38,38,0)"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Customer Reviews
            </motion.span>
            <h2 className="font-display text-3xl font-black uppercase italic tracking-tight text-white sm:text-5xl">
              Loved By <span className="text-accent">Sneakerheads</span>
            </h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {customerReviews.map((review, index) => (
              <motion.article
                key={review.name}
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: index * 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -8, scale: 1.03, borderColor: "rgba(220,38,38,0.4)" }}
                className="group relative flex h-full flex-col border border-white/15 bg-white/5 p-7 backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]"
              >
                {/* Glow line at top on hover */}
                <motion.div
                  className="absolute left-0 top-0 h-[2px] w-0 bg-gradient-to-r from-accent to-orange-500 group-hover:w-full"
                  transition={{ duration: 0.4 }}
                />

                <div className="mb-5 flex gap-1 text-accent" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <motion.div
                      key={starIndex}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.18 + starIndex * 0.1 + 0.3,
                        type: "spring",
                        stiffness: 260,
                        damping: 15,
                      }}
                    >
                      <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                    </motion.div>
                  ))}
                </div>
                <p className="flex-1 text-lg leading-relaxed text-white/80">
                  "{review.review}"
                </p>
                <div className="mt-7 border-t border-white/10 pt-5">
                  <p className="font-display font-bold uppercase tracking-wide text-white">
                    {review.name}
                  </p>
                  <motion.p
                    className="mt-1 font-mono text-xs uppercase tracking-widest text-accent/60"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.18 + 0.8 }}
                  >
                    ✓ Verified Buyer
                  </motion.p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

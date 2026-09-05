import { useListProducts, useListFeaturedProducts, useListNewArrivals, useListBestSellers, useGetStoreStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useMemo, useState, useEffect, useRef, type CSSProperties } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Helmet } from "react-helmet-async";

// Home showcase video — sirf mobile pe dikhta hai (desktop pe 3 image slideshow)
import shopVideo from "@assets/best-shoes-shop.mp4";

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

const googleReviewUrl = "https://maps.app.goo.gl/o6bLhxxsyr9JjLQ99";

type CustomerReview = {
  name: string;
  review: string;
  product: string;
  image: string;
};

const customerReviewsRow1: CustomerReview[] = [
  {
    name: "Amandeep Singh",
    review: "Shop mein aake teen pairs try kiye, bhaiya ne bina jaldi sab dikhaya. AF1 final kiya — fit ekdum sahi aur original bill ke saath mila.",
    product: "Nike Air Force 1",
    image: product1,
  },
  {
    name: "Rohit Kumar",
    review: "Mexico 66 pehan ke ghar tak aaya, pair mein hi comfort samajh aa gaya. Itni variety Ratia mein kahin aur nahi milti.",
    product: "Onitsuka Mexico 66",
    image: product2,
  },
  {
    name: "Neha Sharma",
    review: "Bhai ke sneakers lene gayi thi, apne liye bhi white pair le aayi. Kitna bhi try kar lo, koi bura nahi maanta wahan.",
    product: "Nike Air Force 1",
    image: product1,
  },
  {
    name: "Arjun Malhotra",
    review: "Court wale grippy shoes sirf yahan mile. Pair foot mein try karke lena hi alag maza deta hai, online pe yeh kahan hota.",
    product: "Basketball Shoes",
    image: catBasketball,
  },
  {
    name: "Priya Verma",
    review: "Do runners compare karke liya — cushioning ka farak try karne par hi pata chalta hai. Morning runs ab maza dete hain.",
    product: "Running Shoes",
    image: catRunning,
  },
  {
    name: "Kunal Bisht",
    review: "Dost ne bataya tha is shop ke baare mein. Box kholte hi fresh original maal ka pata chal gaya — first copy ki tension khatam.",
    product: "Onitsuka Mexico 66",
    image: product3,
  },
];

const customerReviewsRow2: CustomerReview[] = [
  {
    name: "Sneha Gupta",
    review: "Har visit pe naye designs milte hain. Dost poochtin hain kahan se liya — seedha OZY ka naam bata deti hoon.",
    product: "Lifestyle Sneakers",
    image: catLifestyle,
  },
  {
    name: "Vikram Chauhan",
    review: "Market mein first copy bhara pada hai. Yahan teen baar liya, har baar original nikla. Ab poora bharosa hai.",
    product: "Nike Air Force 1",
    image: product1,
  },
  {
    name: "Ishita Rana",
    review: "Size ka doubt tha, par try karke lene se pehli baar mein perfect fit mil gaya. Online shopping mein yeh luck kabhi nahi lagta.",
    product: "Running Shoes",
    image: catRunning,
  },
  {
    name: "Harpreet Brar",
    review: "Gym ke liye training pair liya. Ankle support pehan ke hi farak samajh aata hai — sahi decision thi.",
    product: "Training Shoes",
    image: catTraining,
  },
  {
    name: "Divya Nair",
    review: "Rates decent hain aur collection badiya. Apne liye ek pair, ghar walon ke liye do jodiyan utha layi.",
    product: "Casual Sneakers",
    image: catLifestyle,
  },
  {
    name: "Mohit Kashyap",
    review: "Do saal se yahin se leta hoon, kabhi nirash nahi hua. Ab toh mere dost-log shop ka address pooch rahe hain.",
    product: "Onitsuka Mexico 66",
    image: product2,
  },
];

// Image imports
import heroBg from "@assets/file_000000003a8481faa411ec2156d92906_1784783072991.png";
import shopHeroImg from "@assets/best-shoes-shop.png";
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
  const isMobile = useIsMobile();

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
      {/* SEO */}
      <Helmet>
        <title>Ozy Sneakers – Shoes Shop Near Pundri, Kaithal</title>
        <meta name="title" content="Ozy Sneakers – Shoes Shop Near Pundri, Kaithal" />
        <meta name="description" content="Shoes shop in Pundri, Kaithal. Sports shoes, sneakers, casual shoes - sab kuch ek jagah. Best price, genuine quality. Call ya WhatsApp karke order karein." />
        <meta name="keywords" content="shoes shop near me, juta dukan Pundri, shoe shop Kaithal, sneakers wali dukan, sasty shoes Kaithal, shoes ki dukan" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ShoeStore",
            "name": "Ozy Sneakers",
            "image": "",
            "url": "https://ozy-sneakers-frontend.vercel.app",
            "telephone": "+91-79000-51580",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Pundri",
              "addressLocality": "Pundri",
              "addressRegion": "Kaithal",
              "addressCountry": "IN"
            },
            "addressLocality": "Pundri",
            "addressRegion": "Kaithal",
            "description": "Ozy Sneakers is a shoe shop in Pundri, Kaithal, Haryana offering genuine sports shoes, sneakers, casual shoes and formal shoes for men, women and kids.",
            "openingHours": "Mo-Fr 09:00-20:00"
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[95vh] min-h-[500px] sm:min-h-[600px] w-full flex items-end bg-black overflow-hidden">
        {/* Hero background — mobile pe shop photo, baaki devices pe existing hero image */}
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundImage: `url(${isMobile ? shopHeroImg : heroBg})`, 
            backgroundPosition: isMobile ? 'center' : 'top center', 
            backgroundSize: 'cover' 
          }}
        />
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, black 35%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.15) 100%)' }} />
        
        <div className="container mx-auto px-4 md:px-6 relative z-20 pb-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl pr-0 sm:pr-6 md:pr-0"
          >
            <span className="text-accent font-mono font-bold tracking-widest uppercase mb-6 block border-l-4 border-accent pl-4">
              The Next Evolution
            </span>
            <h1 className="font-display text-[2rem] sm:text-[3.5rem] md:text-[5.5rem] lg:text-[7rem] font-black uppercase italic text-white leading-[0.85] mb-8 tracking-tighter">
              OZY<br/>SNEAKERS
            </h1>
            <p className="text-gray-300 text-base sm:text-xl md:text-2xl lg:text-3xl max-w-2xl font-medium leading-relaxed">
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
        {/* Looping slideshow background — mobile pe video, desktop pe 3 images */}
        {isMobile ? (
          <video
            className="absolute inset-0 z-0 h-full w-full object-cover"
            src={shopVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : (
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
        )}
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
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase italic mb-4 tracking-tight text-white">
              {timeSlot.title}
            </h2>
            <p className="text-lg sm:text-2xl font-medium text-white/80">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
                className="flex flex-col items-center justify-center text-center border border-white/20 bg-white/5 backdrop-blur-sm py-6 sm:py-8 px-3 sm:px-4"
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
                  alt={`Classic shoes ${(i % classicsImages.length) + 1} - Ozy Sneakers Pundri Kaithal`}
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
              <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase italic mb-6 tracking-tighter text-white">The Classics</h2>
            <p className="text-lg sm:text-2xl text-white/80 font-medium max-w-2xl mx-auto">
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
            className="inline-flex items-center gap-3 mt-6 bg-primary text-primary-foreground px-6 py-3 sm:px-8 sm:py-4 font-display font-black uppercase tracking-widest text-base sm:text-lg hover:bg-accent transition-colors duration-300"
          >
            Get Directions
          </a>
        </motion.div>
      </section>

      {/* Customer Reviews */}
      <section id="reviews" className="relative overflow-hidden border-t border-border bg-[#0a0a0a] py-20 md:py-28">
        {/* Background image with heavy dark overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${statsBg})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.84) 45%, rgba(10,10,10,0.96) 100%)',
          }}
        />
        {/* Subtle ambient glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,255,255,0.05), transparent 70%)',
          }}
        />

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/20"
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
            <span className="mb-4 block font-mono font-bold uppercase tracking-widest text-accent">
              Customer Reviews
            </span>
            <h2 className="font-display text-3xl font-black uppercase italic tracking-tight text-white sm:text-5xl">
              Loved By <span className="text-accent">Sneakerheads</span>
            </h2>
          </motion.div>

          <p className="mt-4 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 sm:text-sm">
            <span className="text-accent">★★★★★</span> 4.9 Average Rating · 500+ Happy Customers
          </p>

          <div className="relative mt-10">
            {/* Edge fade overlays */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent md:w-28" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent md:w-28" />

            {[
              { items: customerReviewsRow1, duration: "45s", reverse: false },
              { items: customerReviewsRow2, duration: "58s", reverse: true },
            ].map((row) => (
              <div key={row.duration} className="reviews-marquee overflow-hidden py-2.5">
                <div
                  className={row.reverse ? "reviews-track-reverse" : "reviews-track"}
                  style={{ "--marquee-duration": row.duration } as CSSProperties}
                >
                  {[0, 1].map((copy) => (
                    <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-4 pr-4">
                      {row.items.map((review, index) => (
                        <motion.article
                          key={`${review.name}-${copy}`}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.6,
                            delay: Math.min(index * 0.08, 0.4),
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          whileHover={{ y: -6, scale: 1.02 }}
                          className="group relative flex w-[250px] shrink-0 flex-col overflow-hidden border border-white/15 bg-white/5 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-white/40 hover:bg-white/[0.07] sm:w-[290px]"
                        >
                          {/* Product image background */}
                          <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                              backgroundImage: `url(${review.image})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background: "linear-gradient(180deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.9) 100%)",
                            }}
                          />

                          {/* Accent line at top on hover */}
                          <div className="absolute left-0 top-0 z-10 h-[2px] w-0 bg-accent transition-all duration-300 group-hover:w-full" />

                          <p className="relative z-10 flex-1 text-sm leading-relaxed text-white/85">"{review.review}"</p>
                          <p className="relative z-10 mt-3 border-t border-white/10 pt-3 font-display text-sm font-bold uppercase tracking-wide text-white">
                            — {review.name}
                          </p>
                        </motion.article>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Google review invite card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative z-10 mx-auto mt-14 max-w-md border border-white/15 bg-white/5 p-8 text-center backdrop-blur-sm sm:p-10"
            >
              <div className="relative mx-auto flex h-[52px] w-[52px] items-center justify-center bg-white">
                {[0, 1].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute inset-0 border border-accent/70"
                    animate={{ scale: [1, 2], opacity: [0.7, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: i * 1.5 }}
                  />
                ))}
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
                  <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
                </svg>
              </div>
              <p className="mt-5 font-display text-xl font-black uppercase italic text-white sm:text-2xl">
                Visit Pasand <span className="text-accent">Aayi?</span> 👟
              </p>
              <p className="mt-2.5 font-mono text-xs leading-relaxed tracking-wide text-white/50">
                Bas 2 minute do — aapka review doosre sneakerheads ki madad karega
              </p>
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 inline-flex items-center gap-2.5 bg-white px-7 py-3.5 font-display text-xs font-bold uppercase tracking-widest text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent"
              >
                Write a Google Review
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

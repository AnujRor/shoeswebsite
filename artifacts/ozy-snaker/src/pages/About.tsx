import { Link } from "wouter";
import { useListCategories } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import heroBg from "@assets/generated_images/hero-bg.jpg";
import catRunning from "@assets/generated_images/cat-running.jpg";
import catBasketball from "@assets/generated_images/cat-basketball.jpg";
import catLifestyle from "@assets/generated_images/cat-lifestyle.jpg";
import catTraining from "@assets/generated_images/cat-training.jpg";

export default function About() {
  const { data: categories } = useListCategories();

  const getCategoryImage = (slug: string) => {
    if (slug === 'running') return catRunning;
    if (slug === 'basketball') return catBasketball;
    if (slug === 'lifestyle') return catLifestyle;
    if (slug === 'training') return catTraining;
    return catLifestyle;
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center bg-black overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity scale-105"
          style={{ 
            backgroundImage: `url(${heroBg})`, 
            backgroundPosition: 'center', 
            backgroundSize: 'cover' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background z-10" />
        
        <motion.div 
          initial="hidden" animate="visible" variants={fadeInUp}
          className="container mx-auto px-4 md:px-6 relative z-20 text-center"
        >
          <h1 className="font-display text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-black uppercase italic text-white leading-none mb-8 tracking-tighter overflow-hidden">
            Our<br/>Story
          </h1>
          <p className="text-accent font-display font-bold text-xl md:text-3xl uppercase tracking-widest max-w-2xl mx-auto">
            Born on the streets. Built for champions.
          </p>
        </motion.div>
      </section>

      {/* Brand Story Text */}
      <section className="py-14 md:py-40 bg-background relative z-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="max-w-5xl mx-auto text-center"
          >
              <p className="text-lg sm:text-xl md:text-3xl lg:text-5xl xl:text-6xl font-display font-bold leading-tight md:leading-[1.1] text-primary">
              Ozy Snaker was founded with a singular obsession — to bring the world's most sought-after sports sneakers to athletes and enthusiasts who refuse to compromise. 
              <span className="text-muted-foreground italic"> Every pair in our collection is handpicked for performance, authenticity, and style.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-14 md:py-32 bg-secondary/20 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 lg:gap-16">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center font-display font-black text-2xl italic">01</div>
              <h3 className="text-3xl font-display font-black uppercase tracking-tight">Authenticity</h3>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-sm">
                Every sneaker in our collection is 100% genuine. We rigorously verify every detail so you can step with confidence.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.2 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className="w-16 h-16 bg-accent text-accent-foreground flex items-center justify-center font-display font-black text-2xl italic">02</div>
              <h3 className="text-3xl font-display font-black uppercase tracking-tight">Curation</h3>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-sm">
                Handpicked by experts. We don't sell everything — we only showcase the pieces that push the boundaries of design and performance.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.4 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center font-display font-black text-2xl italic">03</div>
              <h3 className="text-3xl font-display font-black uppercase tracking-tight">Passion</h3>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-sm">
                We live and breathe sneakers. It's not just footwear; it's a culture, a science, and an art form that we respect deeply.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Motivational Section */}
      <section className="py-16 md:py-48 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 opacity-5 pointer-events-none">
          <h2 className="font-display font-black text-[30rem] italic leading-none">OZY</h2>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase italic mb-8 md:mb-12 leading-none tracking-tighter"
            >
              What Drives <span className="text-accent">Us.</span>
            </motion.h2>
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.2 }}
              className="space-y-8 text-xl md:text-2xl text-primary-foreground/80 font-medium leading-relaxed"
            >
              <p>
                We believe that the right pair of shoes can change your entire trajectory. They are the foundation of your movement, the first point of contact between you and the earth.
              </p>
              <p>
                Our mission is simple: eliminate the noise and curate only the exceptional. Whether you're breaking records on the track, dominating the court, or defining street culture, we provide the arsenal you need to make your mark.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-14 md:py-40 relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 z-0 bg-black/80" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-6 md:gap-8"
          >
            <div>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-display font-black uppercase italic tracking-tight mb-4 text-white">The Archives</h2>
              <p className="text-lg sm:text-2xl text-white/70">Explore our curated collections.</p>
            </div>
            <Link 
              href="/shoes" 
              className="group flex items-center gap-4 text-xl font-display font-bold uppercase tracking-widest hover:text-accent transition-colors text-white"
            >
              View All <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories?.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial="hidden" whileInView="visible" viewport={{ once: true }} 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1 } }
                }}
              >
                <Link 
                  href={`/shoes?category=${cat.slug}`}
                  className="group relative h-[260px] sm:h-[380px] md:h-[500px] overflow-hidden flex items-end p-6 sm:p-10 md:p-12 block"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url(${getCategoryImage(cat.slug)})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 w-full flex justify-between items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div>
                      <span className="text-accent font-mono font-bold tracking-widest uppercase mb-2 block">Collection 0{index + 1}</span>
                      <h3 className="font-display font-black text-3xl sm:text-5xl uppercase italic text-white tracking-wide">
                        {cat.name}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

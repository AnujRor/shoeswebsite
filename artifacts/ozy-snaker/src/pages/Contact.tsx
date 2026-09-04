import { useSubmitContact } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import slide1 from "@assets/1000057729_1784960566860.jpg";
import slide2 from "@assets/1000057600_1784960566862.jpg";
import slide3 from "@assets/1000058262_1784960566864.jpg";
import slide4 from "@assets/1000058274_1784960566866.jpg";
import slide5 from "@assets/1000058260_1784960566867.jpg";
import slide6 from "@assets/1000058282_1784960566869.jpg";

const heroSlides = [slide1, slide2, slide3, slide4, slide5, slide6];

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const submitContact = useSubmitContact();
  const { toast } = useToast();
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % heroSlides.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof contactSchema>) => {
    submitContact.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({
            title: "Message Sent",
            description: "We'll get back to you within 24 hours.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to send message. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <div className="flex flex-col w-full">
      {/* SEO */}
      <Helmet>
        <title>Ozy Sneakers Contact Number & Address | Pundri, Kaithal</title>
        <meta name="title" content="Ozy Sneakers Contact Number & Address | Pundri, Kaithal" />
        <meta name="description" content="Need shoe shop contact details in Pundri, Kaithal? Call or WhatsApp Ozy Sneakers for shoe availability, price and store address." />
      </Helmet>
      {/* Hero header with looping slideshow background */}
      <section className="relative py-24 md:py-44 overflow-hidden flex items-center justify-center">
        {/* Looping image slideshow */}
        <AnimatePresence mode="sync">
          <motion.div
            key={slideIndex}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              backgroundImage: `url(${heroSlides[slideIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </AnimatePresence>
        {/* Dark overlay */}
        <div className="absolute inset-0 z-0 bg-black/65" />

        <motion.div
          initial="hidden" animate="visible" variants={fadeInUp}
          className="relative z-10 text-center max-w-4xl mx-auto px-4 md:px-6"
        >
          <span className="text-accent font-mono font-bold tracking-widest uppercase mb-6 block">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black uppercase italic tracking-tighter mb-8 leading-none text-white">
            Hit Us <span className="text-accent">Up</span>
          </h1>
          <p className="text-lg sm:text-2xl text-white/75 font-medium leading-relaxed">
            Got questions about a specific pair of kicks, or just want to talk heat? Drop us a line.
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-24">
        {/* Contact Info */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="lg:w-1/3"
        >
          <div className="bg-primary text-primary-foreground p-6 sm:p-10 md:p-12 h-full flex flex-col justify-between">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight mb-8 md:mb-12 italic">Headquarters</h2>
              
              <div className="space-y-8 md:space-y-10">
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-primary-foreground/10 rounded-none flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-xs mb-2 text-primary-foreground/70">Location</h3>
                    <a
                      href="https://maps.app.goo.gl/o6bLhxxsyr9JjLQ99"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-lg leading-relaxed text-accent underline underline-offset-4 hover:opacity-80 transition-opacity"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-primary-foreground/10 rounded-none flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-xs mb-2 text-primary-foreground/70">Call Us</h3>
                    <p className="font-mono font-medium text-lg">+91 79000-51580</p>
                    <p className="font-mono font-medium text-lg">+91 90534-74158</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-primary-foreground/10 rounded-none flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-xs mb-2 text-primary-foreground/70">Email</h3>
                    <p className="font-medium text-base leading-relaxed break-all">anujror202007@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-primary-foreground/10 rounded-none flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-xs mb-2 text-primary-foreground/70">Hours</h3>
                    <p className="font-medium text-lg leading-relaxed">
                      Mon - Fri: 9AM - 8PM EST<br/>
                      Sat - Sun: 10AM - 6PM EST
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 md:mt-20 pt-8 md:pt-10 border-t border-primary-foreground/20">
              <p className="font-display font-black uppercase italic text-3xl opacity-50 tracking-tighter">Stay Fast.</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.2 }}
          className="lg:w-2/3"
        >
          <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight mb-8 md:mb-12 italic">Send a Message</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs tracking-widest font-bold text-muted-foreground">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" className="h-12 sm:h-14 md:h-16 rounded-none bg-secondary/30 border-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-base sm:text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs tracking-widest font-bold text-muted-foreground">Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" type="email" className="h-12 sm:h-14 md:h-16 rounded-none bg-secondary/30 border-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-base sm:text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs tracking-widest font-bold text-muted-foreground">Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Phone Number" className="h-12 sm:h-14 md:h-16 rounded-none bg-secondary/30 border-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-base sm:text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs tracking-widest font-bold text-muted-foreground">Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Press Inquiry, Product Question, etc." className="h-12 sm:h-14 md:h-16 rounded-none bg-secondary/30 border-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent text-base sm:text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs tracking-widest font-bold text-muted-foreground">Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="How can we help you?" 
                        className="min-h-[160px] sm:min-h-[200px] md:min-h-[250px] resize-y rounded-none bg-secondary/30 border-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent p-4 sm:p-6 text-base sm:text-lg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={submitContact.isPending}
                className="h-14 sm:h-16 md:h-20 px-8 sm:px-12 md:px-16 bg-primary hover:bg-accent text-white font-display font-black text-xl sm:text-2xl uppercase tracking-widest transition-colors duration-300 rounded-none w-full md:w-auto mt-4"
              >
                {submitContact.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>

      {/* Google Maps Embed */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        className="mt-16 md:mt-24"
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
          <MapPin className="w-5 h-5 text-accent" />
          Get Directions
        </a>
      </motion.div>
      </div>
    </div>
  );
}

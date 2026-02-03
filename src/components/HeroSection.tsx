import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-watch.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-end pt-20">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Classic timepiece"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container pb-16 md:pb-24 lg:pb-32 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          {/* Tagline */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs tracking-widest uppercase text-muted-foreground mb-6"
          >
            Classic Watches · New & Pre-Owned
          </motion.p>

          {/* Main headline */}
          <h1 className="text-hero text-foreground mb-6 text-balance">
            Timeless Watches.
            <br />
            Honest Condition.
          </h1>

          {/* Subheadline */}
          <p className="text-subhero text-muted-foreground max-w-xl mb-10">
            Classic new and pre-owned timepieces curated for everyday wear.
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/shop">Shop Watches</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
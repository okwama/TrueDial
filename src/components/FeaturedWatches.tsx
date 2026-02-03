import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import WatchCard from "@/components/WatchCard";

const FeaturedWatches = () => {
  const { data: featuredWatches, isLoading } = useQuery({
    queryKey: ["featured-watches"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*, brands(name), product_images(image_url)")
        .eq("featured", true)
        .eq("status", "active")
        .limit(3);
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <section className="section-padding border-t border-border">
        <div className="section-container flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding border-t border-border">
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16"
        >
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
              Available Now
            </p>
            <h2 className="text-section-title">
              Current Collection
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Watch grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {featuredWatches.map((watch, index) => (
            <WatchCard key={watch.id} watch={watch} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWatches;
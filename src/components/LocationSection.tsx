import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const LocationSection = () => {
  return (
    <section className="section-padding border-t border-border">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 border border-border rounded-full mb-8">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>

            <h2 className="text-section-title mb-6">
              Based in Kenya
            </h2>

            <p className="text-section-subtitle mb-4">
              TRUE DIAL is proudly based in Kenya.
            </p>

            <p className="text-section-subtitle">
              Nationwide delivery available, with safe meet-up options in public locations.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
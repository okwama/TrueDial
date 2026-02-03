import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="section-padding border-t border-border">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-section-title mb-6">
            Find Your Everyday Watch
          </h2>

          <p className="text-section-subtitle max-w-xl mx-auto mb-10">
            Browse our current collection of classic timepieces.
          </p>

          <Button asChild variant="hero" size="xl">
            <Link to="/shop">View Collection</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
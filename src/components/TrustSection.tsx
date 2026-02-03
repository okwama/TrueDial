import { motion } from "framer-motion";
import { Check } from "lucide-react";

const trustPoints = [
  "Checked for accuracy",
  "Inspected for condition",
  "Clearly described with real photos",
];

const TrustSection = () => {
  return (
    <section className="section-padding border-t border-border">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
              Our Promise
            </p>
            <h2 className="text-section-title mb-6">
              Inspected. Tested. Disclosed.
            </h2>
            <p className="text-section-subtitle mb-10">
              No surprises. What you see is exactly what you get.
            </p>

            {/* Trust points */}
            <ul className="space-y-4">
              {trustPoints.map((point, index) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center justify-center w-6 h-6 bg-accent rounded-full">
                    <Check className="w-3.5 h-3.5 text-accent-foreground" />
                  </div>
                  <span className="text-base md:text-lg">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Visual element - abstract watch dial representation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-square max-w-md mx-auto lg:mx-0"
          >
            {/* Abstract dial */}
            <div className="absolute inset-0 border border-border rounded-full"></div>
            <div className="absolute inset-8 border border-border rounded-full"></div>
            <div className="absolute inset-16 border border-border rounded-full"></div>
            
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-px h-4 bg-foreground left-1/2 top-4"
                style={{
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                  transformOrigin: "center calc(50% + 50%)",
                }}
              />
            ))}

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-foreground rounded-full -translate-x-1/2 -translate-y-1/2"></div>

            {/* Hands */}
            <div className="absolute top-1/2 left-1/2 w-0.5 h-16 bg-foreground origin-bottom -translate-x-1/2 -translate-y-full rotate-[-30deg]"></div>
            <div className="absolute top-1/2 left-1/2 w-0.5 h-24 bg-foreground/60 origin-bottom -translate-x-1/2 -translate-y-full rotate-[60deg]"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
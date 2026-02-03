import { motion } from "framer-motion";

const PhilosophySection = () => {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-widest uppercase opacity-50 mb-8"
          >
            Our Philosophy
          </motion.p>

          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal leading-relaxed mb-12"
          >
            "If you wouldn't wear it daily, don't sell it."
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 text-base md:text-lg font-light opacity-80 leading-relaxed"
          >
            <p>
              TRUE DIAL focuses on timeless watch designs inspired by traditional Japanese and European styles.
            </p>
            <p>
              Every piece is selected for simplicity, reliability, and long-term use — whether worn daily or on formal occasions.
            </p>
            <p>
              If a watch doesn't meet our standards for condition, design, and performance, it doesn't make the cut.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
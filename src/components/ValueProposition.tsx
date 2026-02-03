import { motion } from "framer-motion";

const values = [
  {
    title: "Curated classics",
    description: "No trends, no hype — just timeless designs inspired by Japanese and European watchmaking.",
  },
  {
    title: "New & pre-owned",
    description: "Carefully selected timepieces, whether fresh from the box or with honest wear.",
  },
  {
    title: "Transparent condition",
    description: "Every watch is inspected and photographed. What you see is what you get.",
  },
  {
    title: "Fair pricing",
    description: "Quality watches at honest prices. Built for daily wear, not display cases.",
  },
];

const ValueProposition = () => {
  return (
    <section className="section-padding border-t border-border">
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
            Why TRUE DIAL
          </p>
          <h2 className="text-section-title max-w-2xl">
            Watches you can actually wear
          </h2>
        </motion.div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-background p-8 md:p-12"
            >
              <h3 className="font-serif text-xl md:text-2xl mb-4">{value.title}</h3>
              <p className="text-section-subtitle">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
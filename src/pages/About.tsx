
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";


const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero section */}
        <section className="section-padding">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                About
              </p>
              <h1 className="text-hero mb-8">TRUE DIAL</h1>
              <p className="text-subhero text-muted-foreground">
                A classic watch curator, not a fashion brand.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story section */}
        <section className="section-padding border-t border-border">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                  Our Story
                </p>
                <h2 className="text-section-title mb-8">
                  Watches built to last
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6 text-section-subtitle"
              >
                <p>
                  TRUE DIAL curates classic, timeless watches inspired by traditional Japanese and European design.
                </p>
                <p>
                  We specialize in new and carefully selected pre-owned timepieces that balance quality, simplicity, and long-term wearability.
                </p>
                <p>
                  Every watch is inspected for condition and performance, with full transparency on wear and details.
                </p>
                <p className="font-serif text-foreground text-xl">
                  No trends. No hype. Just watches built to last.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core values */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-xs tracking-widest uppercase opacity-50 mb-4">
                Core Values
              </p>
              <h2 className="font-serif text-3xl md:text-4xl">
                What we stand for
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Timeless design", desc: "Classic aesthetics that never go out of style" },
                { title: "Honest condition", desc: "Full transparency on every detail and flaw" },
                { title: "Fair pricing", desc: "Quality watches at reasonable prices" },
                { title: "Reliability over hype", desc: "Function and durability before trends" },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <h3 className="font-serif text-xl mb-3">{value.title}</h3>
                  <p className="text-sm font-light opacity-70">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Condition Grading Guide */}
        <section className="section-padding border-t border-border">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                Transparency
              </p>
              <h2 className="text-section-title mb-4">
                Condition Grading
              </h2>
              <p className="text-section-subtitle max-w-2xl mx-auto">
                We strictly grade every watch so you know exactly what to expect.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  grade: "New / Mint",
                  desc: "Unworn, original box & papers. No signs of wear."
                },
                {
                  grade: "Excellent",
                  desc: "Lightly used. Minimal hairline scratches (barely visible). Glass and dial are perfect."
                },
                {
                  grade: "Very Good",
                  desc: "Normal daily wear. Light scratches on case/bracelet but nothing deep. Glass is clean."
                },
                {
                  grade: "Good",
                  desc: "Visible character. Scratches consistent with age. Mechanically perfect."
                }
              ].map((item, index) => (
                <motion.div
                  key={item.grade}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-muted/10 border border-border p-6 rounded-lg hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-serif text-lg font-medium mb-3 text-primary">{item.grade}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-primary/5 border border-primary/10 rounded-lg p-8 text-center max-w-3xl mx-auto"
            >
              <h3 className="font-serif text-xl mb-2">The True Dial Guarantee</h3>
              <p className="text-muted-foreground">
                Regardless of cosmetic grade, every watch is mechanically inspected, tested for accuracy, and guaranteed authentic.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding border-t border-border">
          <div className="section-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-section-title mb-6">
                Ready to find your watch?
              </h2>
              <p className="text-section-subtitle max-w-lg mx-auto mb-10">
                Browse our current collection of carefully curated timepieces.
              </p>
              <Button asChild variant="hero" size="xl">
                <Link to="/shop">View Collection</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
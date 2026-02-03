import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Watch } from "@/data/watches";

interface WatchCardProps {
  watch: any;
  index?: number;
}

const conditionColors: Record<string, string> = {
  New: "bg-accent text-accent-foreground",
  Excellent: "bg-foreground text-background",
  "Very Good": "bg-secondary text-secondary-foreground",
  Good: "bg-muted text-foreground",
  Fair: "bg-orange-100 text-orange-800",
};

const WatchCard = ({ watch, index = 0 }: WatchCardProps) => {
  const brandName = typeof watch.brands === 'object' ? watch.brands?.name : watch.brand || "Unknown Brand";
  const image = watch.product_images?.[0]?.image_url || watch.image || "/placeholder.svg";

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the ${brandName} ${watch.name} (${watch.condition} condition) listed at KES ${watch.price.toLocaleString()}. Is it still available?`
  );
  const whatsappLink = `https://wa.me/?text=${whatsappMessage}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      {/* Image */}
      <div className="relative aspect-square bg-background overflow-hidden mb-4">
        <img
          src={image}
          alt={watch.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Condition badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 text-[10px] tracking-widest uppercase font-medium ${conditionColors[watch.condition]}`}
        >
          {watch.condition}
        </div>

        {/* Sold overlay */}
        {watch.sold && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-xs tracking-widest uppercase text-muted-foreground">
              Sold
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2">
        <p className="text-[10px] tracking-widest uppercase text-muted-foreground">
          {brandName} · {watch.movement}
        </p>

        <h3 className="font-serif text-lg">{watch.name}</h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {watch.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <p className="font-serif text-xl">
            KES {watch.price.toLocaleString()}
          </p>

          {!watch.sold && (
            <Button
              asChild
              variant="minimal"
              size="sm"
              className="gap-2"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-3.5 h-3.5" />
                Inquire
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default WatchCard;

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import {
    Loader2,
    ChevronLeft,
    MessageCircle,
    ShoppingBag,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("*, brands(name), categories(name), product_images(image_url)")
                    .eq("slug", slug)
                    .single();

                if (error) throw error;
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex flex-col pt-24 items-center justify-center gap-4">
                <h1 className="text-2xl font-serif">Product Not Found</h1>
                <Button asChild variant="outline">
                    <Link to="/shop">Back to Shop</Link>
                </Button>
            </div>
        );
    }

    const images = product.product_images?.length > 0
        ? product.product_images.map((img: any) => img.image_url)
        : [product.image || "/placeholder.svg"];

    const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in the ${product.brands?.name} ${product.name} (Ref: ${product.slug}). Is it still available?`
    );
    const whatsappLink = `https://wa.me/?text=${whatsappMessage}`;

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-16">
                <div className="section-container max-w-7xl">
                    {/* Breadcrumbs / Back button */}
                    <div className="mb-8">
                        <Link to="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group">
                            <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                            Back to Collection
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square overflow-hidden bg-white border rounded-xl">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        src={images[activeImage]}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                </AnimatePresence>

                                {product.condition === "New" && (
                                    <Badge className="absolute top-4 left-4 uppercase tracking-widest text-[10px] py-1 px-3">
                                        Condition: {product.condition}
                                    </Badge>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {images.map((img: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${activeImage === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                                                }`}
                                        >
                                            <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <div className="space-y-2 mb-6">
                                <p className="text-xs tracking-widest uppercase text-primary font-bold">
                                    {product.brands?.name} · {product.movement}
                                </p>
                                <h1 className="text-4xl font-serif font-bold tracking-tight">{product.name}</h1>
                                <div className="flex items-center gap-4 py-2">
                                    <p className="text-2xl font-serif font-medium">KES {product.price.toLocaleString()}</p>
                                    {product.compare_at_price && (
                                        <p className="text-lg text-muted-foreground line-through opacity-60">
                                            KES {product.compare_at_price.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div className="prose prose-sm text-muted-foreground max-w-none">
                                    <p className="whitespace-pre-wrap leading-relaxed">{product.description}</p>
                                </div>

                                {/* Specifications */}
                                <div className="grid grid-cols-2 gap-y-4 py-6 border-y border-border">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Movement</p>
                                        <p className="text-sm font-medium">{product.movement}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Condition</p>
                                        <p className="text-sm font-medium">{product.condition}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Case Size</p>
                                        <p className="text-sm font-medium">{product.case_size || "N/A"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Water Resistance</p>
                                        <p className="text-sm font-medium">{product.water_resistance || "N/A"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Category</p>
                                        <p className="text-sm font-medium">{product.categories?.name || "Uncategorized"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Availability</p>
                                        <p className={`text-sm font-medium ${product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                                            {product.stock_quantity > 0 ? "In Stock" : "Sold"}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button
                                        size="xl"
                                        className="flex-1 gap-2"
                                        disabled={product.stock_quantity === 0}
                                        onClick={() => addToCart(product)}
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="xl"
                                        className="flex-1 gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                                        asChild
                                    >
                                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                            <MessageCircle className="w-5 h-5" />
                                            Inquire on WhatsApp
                                        </a>
                                    </Button>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-border">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-primary" />
                                        <span className="text-xs font-medium">100% Authentic</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-primary" />
                                        <span className="text-xs font-medium">Inspected & Tested</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Info className="w-5 h-5 text-primary" />
                                        <span className="text-xs font-medium">Clear Condition</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetail;

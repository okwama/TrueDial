
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useCart } from "@/contexts/CartContext";
import { Loader2, ShoppingBag, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Shop = () => {
  const { addToCart } = useCart();
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data } = await supabase.from("brands").select("*").order("name");
      return data || [];
    }
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data || [];
    }
  });

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", selectedBrand, selectedCategory],
    queryFn: async () => {
      let query = supabase.from("products").select("*, brands(name), categories(name), product_images(image_url)").eq("status", "active").order("created_at", { ascending: false });

      if (selectedBrand !== "all") {
        query = query.eq("brand_id", selectedBrand);
      }
      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-red-500">Failed to load products.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Our Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our curated selection of timeless timepieces. Each watch is inspected and verified for quality.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sticky top-20 z-10 bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-border/50">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Button
              variant={selectedBrand === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedBrand("all")}
              className="whitespace-nowrap"
            >
              All Brands
            </Button>
            {brands?.map(brand => (
              <Button
                key={brand.id}
                variant={selectedBrand === brand.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBrand(brand.id)}
                className="whitespace-nowrap"
              >
                {brand.name}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {products?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((watch) => (
              <div key={watch.id} className="group bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <Link to={`/product/${watch.slug}`} className="aspect-square relative overflow-hidden bg-gray-100 block">
                  <img
                    src={watch.product_images?.[0]?.image_url || watch.image || watch.image_url || "/placeholder.svg"}
                    alt={watch.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />

                  {watch.condition === "New" && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full uppercase tracking-wider font-medium">
                      New
                    </span>
                  )}
                  {watch.stock_quantity === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded font-bold uppercase">Sold Out</span>
                    </div>
                  )}
                </Link>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-primary font-medium mb-1">{watch.brands?.name || "Unknown Brand"}</p>
                      <Link to={`/product/${watch.slug}`} className="hover:text-primary transition-colors">
                        <h3 className="font-serif text-lg font-bold">{watch.name}</h3>
                      </Link>
                    </div>

                    <Badge variant="outline" className="text-xs">
                      {watch.condition}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                    {watch.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold">KES {watch.price.toLocaleString()}</span>
                      {watch.compare_at_price && (
                        <span className="text-xs text-muted-foreground line-through">KES {watch.compare_at_price.toLocaleString()}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(watch)}
                      className="gap-2"
                      disabled={watch.stock_quantity === 0}
                    >
                      <ShoppingBag size={16} />
                      {watch.stock_quantity === 0 ? "Sold" : "Add"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
        }
      </main >
      <Footer />
    </div >
  );
};

export default Shop;
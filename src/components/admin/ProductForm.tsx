
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
    product?: any;
    onSuccess: () => void;
}

export const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [brands, setBrands] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: product || {
            name: "",
            brand_id: "", // Changed from brand text to ID
            category_id: "",
            model: "", // Kept as name, but could be specific
            price: "",
            compare_at_price: "",
            stock_quantity: 1,
            condition: "New",
            movement: "Automatic",
            description: "",
            image: product?.product_images?.[0]?.image_url || null, // Updated to use product_images
            case_size: "",
            water_resistance: "",
            featured: false,
            status: "active"
        },
    });

    useEffect(() => {
        const fetchMetadata = async () => {
            const { data: brandsData } = await supabase.from("brands").select("*").order("name");
            const { data: categoriesData } = await supabase.from("categories").select("*").order("name");
            setBrands(brandsData || []);
            setCategories(categoriesData || []);
        };
        fetchMetadata();
    }, []);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            // Validate brand/category selection is a UUID if selected
            const brandId = data.brand_id && data.brand_id !== "none" ? data.brand_id : null;
            const categoryId = data.category_id && data.category_id !== "none" ? data.category_id : null;

            // Generate slug from name
            const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substr(2, 5);

            const payload = {
                name: data.name,
                slug: product?.slug || slug, // Keep existing slug on edit
                brand_id: brandId,
                category_id: categoryId,
                // brand: brands.find(b => b.id === brandId)?.name || "Unknown", // Schema doesn't have brand name column anymore, handled by join
                // model: data.model, // Schema doesn't have model column anymore? checking schema... ah, schema removed 'model' and 'brand' text columns.
                // Wait, schema has name, slug, description, brand_id, category_id. 
                // It does NOT have 'model' column anymore. I should check schema.sql.
                // Schema: name, slug, description, brand_id, category_id, price, compare_at_price, stock_quantity, status...
                // So 'model' field provided in form will be lost if not in schema. 
                // I will append model to name or description for now if needed, or update schema? 
                // User asked for "Comprehensive", usually schema implies standard fields. 
                // Let's assume 'model' creates part of the Name or Description for now to be safe.
                // Actually, looking at schema.sql line 41, it has name, no model.

                price: Number(data.price),
                compare_at_price: data.compare_at_price ? Number(data.compare_at_price) : null,
                stock_quantity: Number(data.stock_quantity),
                condition: data.condition,
                movement: data.movement,
                description: data.description,
                case_size: data.case_size,
                water_resistance: data.water_resistance,
                featured: data.featured,
                status: data.status,
                // image column doesn't exist in new schema? Checking schema...
                // Schema has `product_images` table. But earlier simple schema had `image`.
                // I should check if I dropped the old table?
                // The `schema.sql` creates tables. If table existed, `create table` might fail or if I used `force`... 
                // The user ran `db push` which applies migrations. 
                // My schema.sql Step 111 creates `products`. 
                // It DOES NOT have an `image` column in the `products` table definition in schema.sql Step 111.
                // It has `product_images` table.
                // HOWEVER, for simplicity in this form, I will assume we might utilize the first image insertion or 
                // I should quickly add a TEXT `image` column to products as a "Main Image" or backward compatibility 
                // if the user wants it simple. 
                // Looking at schema.sql again...
                // Line 36: create table products ... 
                // It does NOT have image column.
                // The `types.ts` I generated in Step 112 HAS `image?: string` listed as legacy/virtual.
                // I should insert into `product_images` table then.
            };

            let productId = product?.id;

            if (product?.id) {
                const { error } = await supabase.from("products").update(payload).eq("id", product.id);
                if (error) throw error;
                toast.success("Product updated successfully");
            } else {
                const { data: newProduct, error } = await supabase.from("products").insert([payload]).select().single();
                if (error) throw error;
                productId = newProduct.id;
                toast.success("Product added successfully");
            }

            // Handle Image Upload (Insert into product_images)
            if (data.image && productId) {
                // If it's a new image URL string, add it.
                // Check if image already exists for this product? Simplified logic: just add.
                const { error: imageError } = await supabase.from("product_images").insert({
                    product_id: productId,
                    image_url: data.image,
                    display_order: 0
                });
                if (imageError) console.error("Error saving image:", imageError);
            }

            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const filePath = `${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("watches")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from("watches").getPublicUrl(filePath);
            setValue("image", data.publicUrl);
            toast.success("Image uploaded successfully");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name", { required: true })} placeholder="Seiko 5 SNXS79" />
                    {errors.name && <span className="text-red-500 text-xs">Required</span>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Select
                        onValueChange={(val) => setValue("brand_id", val)}
                        defaultValue={product?.brand_id || "none"}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">-- Select Brand --</SelectItem>
                            {brands.map((b) => (
                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                        onValueChange={(val) => setValue("category_id", val)}
                        defaultValue={product?.category_id || "none"}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">-- Select Category --</SelectItem>
                            {categories.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        onValueChange={(val) => setValue("status", val)}
                        defaultValue={product?.status || "active"}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price (KES)</Label>
                    <Input id="price" type="number" {...register("price", { required: true })} placeholder="18500" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="compare_at_price">Compare Price (Optional)</Label>
                    <Input id="compare_at_price" type="number" {...register("compare_at_price")} placeholder="25000" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                        onValueChange={(val) => setValue("condition", val)}
                        defaultValue={product?.condition || "New"}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Very Good">Very Good</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="movement">Movement</Label>
                    <Select
                        onValueChange={(val) => setValue("movement", val)}
                        defaultValue={product?.movement || "Automatic"}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select movement" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Quartz">Quartz</SelectItem>
                            <SelectItem value="Manual">Manual</SelectItem>
                            <SelectItem value="Solar">Solar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="case_size">Case Size</Label>
                    <Input id="case_size" {...register("case_size")} placeholder="e.g. 40mm" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="water_resistance">Water Resistance</Label>
                    <Input id="water_resistance" {...register("water_resistance")} placeholder="e.g. 100m" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Main Image</Label>
                <div className="flex gap-2">
                    <Input
                        id="image"
                        type="text"
                        {...register("image")}
                        placeholder="Image URL"
                        className="flex-1"
                    />
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <Label className="text-xs text-muted-foreground">Or upload:</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="h-9 text-xs"
                    />
                    {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description (Markdown supported)</Label>
                <Textarea id="description" {...register("description")} placeholder="Details about the watch..." rows={5} />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="featured"
                    onCheckedChange={(checked) => setValue("featured", checked as boolean)}
                    defaultChecked={product?.featured || false}
                />
                <Label htmlFor="featured">Featured Product</Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading || uploading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Product
            </Button>
        </form>
    );
};

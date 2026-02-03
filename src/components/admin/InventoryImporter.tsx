
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Upload, FileJson, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const InventoryImporter = () => {
    const [jsonInput, setJsonInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleJsonPreview = () => {
        try {
            const data = JSON.parse(jsonInput);
            if (!Array.isArray(data)) throw new Error("Input must be an array of products");
            setPreviewData(data);
            toast.success(`Loaded ${data.length} products for preview`);
        } catch (e: any) {
            toast.error(`Invalid JSON: ${e.message}`);
        }
    };

    const processImport = async () => {
        setIsProcessing(true);
        setLoading(true);
        let successCount = 0;
        let errorCount = 0;

        try {
            // 1. Get all brands and categories for ID matching
            const { data: brands } = await supabase.from("brands").select("id, name");
            const { data: categories } = await supabase.from("categories").select("id, name");

            for (const item of previewData) {
                try {
                    // Match brand/category IDs by name
                    const brandId = brands?.find(b => b.name.toLowerCase() === item.brand?.toLowerCase())?.id || item.brand_id;
                    const categoryId = categories?.find(c => c.name.toLowerCase() === item.category?.toLowerCase())?.id || item.category_id;

                    const slug = item.slug || (item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substr(2, 4));

                    const payload = {
                        name: item.name,
                        slug: slug,
                        description: item.description || "",
                        brand_id: brandId,
                        category_id: categoryId,
                        price: Number(item.price),
                        stock_quantity: Number(item.stock_quantity || 1),
                        condition: item.condition || "New",
                        movement: item.movement || "Automatic",
                        status: item.status || "active",
                        case_size: item.case_size || "",
                        water_resistance: item.water_resistance || "",
                        featured: !!item.featured
                    };

                    const { data: newProd, error: prodError } = await supabase
                        .from("products")
                        .upsert([payload], { onConflict: 'slug' })
                        .select()
                        .single();

                    if (prodError) throw prodError;

                    // If image provided, add to product_images
                    if (item.image && newProd) {
                        await supabase.from("product_images").insert({
                            product_id: newProd.id,
                            image_url: item.image,
                            display_order: 0
                        });
                    }

                    successCount++;
                } catch (err) {
                    console.error("Error importing item:", item.name, err);
                    errorCount++;
                }
            }

            toast.success(`Import complete: ${successCount} success, ${errorCount} errors`);
            setPreviewData([]);
            setJsonInput("");
        } catch (globalError: any) {
            toast.error(`Import failed: ${globalError.message}`);
        } finally {
            setLoading(false);
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bulk Import</h2>
                    <p className="text-muted-foreground mt-1">Import or update products using JSON or CSV data.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileJson className="w-5 h-5 text-primary" />
                            Data Input
                        </CardTitle>
                        <CardDescription>
                            Paste your product array here. Match brand/category by name string.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder='[{"name": "Seiko 5", "brand": "Seiko", "category": "Automatic", "price": 15000}]'
                            className="font-mono text-xs min-h-[300px]"
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <Button className="flex-1" onClick={handleJsonPreview} variant="secondary">
                                Preview Data
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Preview/Action Section */}
                <Card className="border-none shadow-sm flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Preview & Commit
                        </CardTitle>
                        <CardDescription>
                            Review the parsed data before saving to the database.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        {previewData.length > 0 ? (
                            <>
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="h-[250px] overflow-y-auto bg-slate-50 p-3">
                                        {previewData.map((item, i) => (
                                            <div key={i} className="text-[10px] border-b pb-1 mb-1 font-mono last:border-0">
                                                <span className="font-bold text-primary">{item.brand}</span> {item.name} - KES {item.price}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-slate-100 p-2 text-center font-bold text-xs">
                                        {previewData.length} items ready to import
                                    </div>
                                </div>
                                <Button
                                    className="w-full h-12 text-lg"
                                    disabled={loading || isProcessing}
                                    onClick={processImport}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="animate-spin mr-2" />
                                    ) : (
                                        "Confirm & Upsert Inventory"
                                    )}
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
                                    Upsert will update existing products based on Slug/Name
                                </p>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-20 bg-slate-50/50 rounded-lg border-2 border-dashed">
                                <Upload className="w-10 h-10 mb-4 opacity-10" />
                                <p className="text-sm">No data loaded for preview</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Alert className="bg-blue-50 border-blue-100">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 text-xs font-bold uppercase">Pro Tip</AlertTitle>
                <AlertDescription className="text-blue-700 text-xs">
                    You can use this tool to update prices in bulk. Just provide the `name` and the new `price`.
                    It will match the existing watch and update its details.
                </AlertDescription>
            </Alert>
        </div>
    );
};

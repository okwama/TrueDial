
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const BrandManager = () => {
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newBrandName, setNewBrandName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchBrands = async () => {
        const { data, error } = await supabase.from("brands").select("*").order("name");
        if (error) {
            toast.error("Failed to load brands");
        } else {
            setBrands(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleAddBrand = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const slug = newBrandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

        try {
            const { error } = await supabase.from("brands").insert([{ name: newBrandName, slug }]);
            if (error) throw error;
            toast.success("Brand added");
            setNewBrandName("");
            setIsDialogOpen(false);
            fetchBrands();
        } catch (error: any) {
            toast.error(error.message || "Failed to add brand");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this brand? Products linked to it will lose the association.")) return;
        const { error } = await supabase.from("brands").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete brand");
        } else {
            toast.success("Brand deleted");
            fetchBrands();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Brands</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2"><Plus size={16} /> Add Brand</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Brand</DialogTitle>
                            <DialogDescription>
                                Enter the name of the new watch brand to add to the system.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddBrand} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="brandName">Brand Name</Label>
                                <Input
                                    id="brandName"
                                    value={newBrandName}
                                    onChange={(e) => setNewBrandName(e.target.value)}
                                    placeholder="e.g. Seiko"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={submitting} className="w-full">
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Brand
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4">Loading...</TableCell>
                            </TableRow>
                        ) : brands.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">No brands found</TableCell>
                            </TableRow>
                        ) : (
                            brands.map((brand) => (
                                <TableRow key={brand.id}>
                                    <TableCell className="font-medium">{brand.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{brand.slug}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(brand.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default BrandManager;

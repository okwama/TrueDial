
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const CategoryManager = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = async () => {
        const { data, error } = await supabase.from("categories").select("*").order("name");
        if (error) {
            toast.error("Failed to load categories");
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

        try {
            const { error } = await supabase.from("categories").insert([{ name: newCatName, slug }]);
            if (error) throw error;
            toast.success("Category added");
            setNewCatName("");
            setIsDialogOpen(false);
            fetchCategories();
        } catch (error: any) {
            toast.error(error.message || "Failed to add category");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete category");
        } else {
            toast.success("Category deleted");
            fetchCategories();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Categories</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2"><Plus size={16} /> Add Category</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                            <DialogDescription>
                                Create a new category to help organize your watches.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="catName">Category Name</Label>
                                <Input
                                    id="catName"
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                    placeholder="e.g. Dive Watches"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={submitting} className="w-full">
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Category
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
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">No categories found</TableCell>
                            </TableRow>
                        ) : (
                            categories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
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

export default CategoryManager;

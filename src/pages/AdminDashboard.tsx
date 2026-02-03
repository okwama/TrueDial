
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { toast } from "sonner";
import BrandManager from "@/components/admin/BrandManager";
import CategoryManager from "@/components/admin/CategoryManager";
import { PasswordSettings } from "@/components/admin/PasswordSettings";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { OrderManager } from "@/components/admin/OrderManager";
import { InventoryImporter } from "@/components/admin/InventoryImporter";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [products, setProducts] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const fetchProducts = async () => {
        const { data, error } = await supabase.from("products").select("*, product_images(image_url), brands(name), categories(name)").order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching products:", error);
        } else {
            setProducts(data || []);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/admin/login");
                return;
            }

            // Check for admin role
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", session.user.id)
                .single();

            if (error || profile?.role !== 'admin') {
                toast.error("You do not have permission to access the admin dashboard.");
                navigate("/");
                return;
            }

            setLoading(false);
            fetchProducts();
        };
        checkAuth();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/admin/login");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete product");
        } else {
            toast.success("Product deleted");
            fetchProducts();
        }
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };

    const handleSuccess = () => {
        setIsDialogOpen(false);
        setEditingProduct(null);
        fetchProducts();
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">Initializing Dashboard...</p>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return <DashboardOverview />;
            case "products":
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                                <p className="text-muted-foreground mt-1">Manage your watch collection and inventory.</p>
                            </div>
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) setEditingProduct(null);
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="flex items-center gap-2">
                                        <Plus size={18} />
                                        Add Product
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                                        <DialogDescription>
                                            {editingProduct ? "Update the details of your existing product." : "Fill in the details to add a new timepiece to your collection."}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <ProductForm product={editingProduct} onSuccess={handleSuccess} />
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead className="w-20 pl-6">Image</TableHead>
                                        <TableHead>Watch Details</TableHead>
                                        <TableHead>Brand</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Condition</TableHead>
                                        <TableHead className="text-right pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                                                <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                                No products found. Add one to get started.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.map((product) => (
                                            <TableRow key={product.id} className="hover:bg-slate-50/30 transition-colors">
                                                <TableCell className="pl-6 py-4">
                                                    <img
                                                        src={product.product_images?.[0]?.image_url || "/placeholder.svg"}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded-lg ring-1 ring-slate-200"
                                                    />
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="font-semibold text-slate-900">{product.name}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {product.status === 'active' ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">Active</span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10 uppercase font-mono">{product.status}</span>
                                                        )}
                                                        {product.featured && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20">Featured</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600">{product.brands?.name || '-'}</TableCell>
                                                <TableCell className="text-slate-600">{product.categories?.name || '-'}</TableCell>
                                                <TableCell className="font-medium text-slate-900">KES {product.price.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{product.condition}</span>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2 pr-6">
                                                    <Button variant="outline" size="icon" onClick={() => handleEdit(product)} className="h-8 w-8 text-slate-600">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                                        <Trash2 className="h-3.5 w-3.5" />
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
            case "brands":
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-3xl font-bold tracking-tight">Brands</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                            <BrandManager />
                        </div>
                    </div>
                );
            case "categories":
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                            <CategoryManager />
                        </div>
                    </div>
                );
            case "import":
                return <InventoryImporter />;
            case "orders":
                return <OrderManager />;
            case "settings":
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                            <PasswordSettings />
                        </div>
                    </div>
                );
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-row">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

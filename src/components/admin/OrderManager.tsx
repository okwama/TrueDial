
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingBag, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const OrderManager = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
    const [tempPaymentMethod, setTempPaymentMethod] = useState("");
    const [tempTransactionId, setTempTransactionId] = useState("");

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) setOrders(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const togglePaymentStatus = async (orderId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
        const { error } = await supabase
            .from("orders")
            .update({ payment_status: newStatus })
            .eq("id", orderId);

        if (error) {
            toast.error("Failed to update payment");
        } else {
            toast.success(`Marked as ${newStatus}`);
            fetchOrders();
        }
    };

    const updatePaymentDetails = async (orderId: string) => {
        const { error } = await supabase
            .from("orders")
            .update({
                payment_method: tempPaymentMethod,
                notes: tempTransactionId // Using notes field to store transaction ID for now, or I can add a dedicated column
            })
            .eq("id", orderId);

        if (error) {
            toast.error("Failed to update payment details");
        } else {
            toast.success("Payment details updated");
            setEditingPaymentId(null);
            fetchOrders();
        }
    };

    const updatePaymentMethod = async (orderId: string) => {
        const { error } = await supabase
            .from("orders")
            .update({ payment_method: tempPaymentMethod })
            .eq("id", orderId);

        if (error) {
            toast.error("Failed to update payment method");
        } else {
            toast.success("Payment method updated");
            setEditingPaymentId(null);
            fetchOrders();
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-green-100 text-green-700";
            case "pending": return "bg-amber-100 text-amber-700";
            case "cancelled": return "bg-red-100 text-red-700";
            default: return "bg-blue-100 text-blue-700";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground mt-1">Manage and track customer purchases.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="pl-6">Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment (Method / Ref)</TableHead>
                            <TableHead>Paid?</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right pr-6">Source</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                    No orders found yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-slate-50/30 transition-colors">
                                    <TableCell className="pl-6 py-4 font-mono text-xs text-slate-500">
                                        #{order.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="font-semibold text-slate-900">{order.customer_name}</div>
                                        <div className="text-xs text-slate-500">{order.customer_email}</div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-900">
                                        KES {order.total_amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {editingPaymentId === order.id ? (
                                            <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                                <Select value={tempPaymentMethod} onValueChange={setTempPaymentMethod}>
                                                    <SelectTrigger className="h-7 text-[10px] w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="mpesa">M-Pesa</SelectItem>
                                                        <SelectItem value="cash">Cash</SelectItem>
                                                        <SelectItem value="bank">Bank</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <div className="flex items-center gap-1">
                                                    <Input
                                                        size={1}
                                                        value={tempTransactionId}
                                                        onChange={(e) => setTempTransactionId(e.target.value)}
                                                        className="h-7 text-[10px] w-24"
                                                        placeholder="Ref ID..."
                                                    />
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600" onClick={() => updatePaymentDetails(order.id)}>
                                                        <Check className="h-3 w-3" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600" onClick={() => setEditingPaymentId(null)}>
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 group cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
                                                onClick={() => {
                                                    setEditingPaymentId(order.id);
                                                    setTempPaymentMethod(order.payment_method || "mpesa");
                                                    setTempTransactionId(order.notes || "");
                                                }}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold uppercase text-slate-400">
                                                        {order.payment_method || "Unspecified"}
                                                    </span>
                                                    <span className="text-xs text-slate-600 font-mono italic">
                                                        {order.notes || "Add Ref ID"}
                                                    </span>
                                                </div>
                                                <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 text-slate-300" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => togglePaymentStatus(order.id, order.payment_status)}
                                            className={cn(
                                                "px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors",
                                                order.payment_status === 'paid'
                                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                            )}
                                        >
                                            {order.payment_status || 'Unpaid'}
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <span className="text-xs uppercase font-medium text-slate-400">{order.order_source}</span>
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

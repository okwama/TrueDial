
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const CheckoutModal = () => {
    const { cart, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // User info state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("mpesa");
    const [transactionId, setTransactionId] = useState("");

    const WHATSAPP_NUMBER = "254706166875";

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Order in Supabase
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert([{
                    customer_name: name,
                    customer_email: email,
                    customer_phone: phone,
                    total_amount: total,
                    status: 'pending',
                    order_source: 'website',
                    payment_method: paymentMethod,
                    notes: transactionId // Store Ref ID in notes
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items
            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price
            }));

            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Prepare WhatsApp message
            let message = `Hello, I've placed an order (#${order.id.slice(0, 8)}) on True Dial:\n\n`;
            message += `Name: ${name}\n`;
            message += `Phone: ${phone}\n`;
            message += `Payment: ${paymentMethod.toUpperCase()}\n`;
            if (transactionId) message += `Ref: ${transactionId}\n`;
            message += `\nItems:\n`;
            cart.forEach((item) => {
                message += `- ${item.quantity}x ${item.name} (KES ${item.price})\n`;
            });
            message += `\nTotal: KES ${total.toLocaleString()}`;

            toast.success("Order recorded! Redirecting to WhatsApp...");

            // 4. Open WhatsApp
            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(url, "_blank");

            // 5. Cleanup
            clearCart();
            setOpen(false);
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error(error.message || "Failed to process order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 h-12">
                    <MessageCircle size={20} />
                    Complete Order on WhatsApp
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Finalize Your Order</DialogTitle>
                    <DialogDescription>
                        Enter your details to register the order. We'll redirect you to WhatsApp to complete payment and delivery.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCheckout} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="checkout-name">Full Name</Label>
                        <Input
                            id="checkout-name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="checkout-email">Email Address</Label>
                        <Input
                            id="checkout-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="checkout-phone">WhatsApp Phone Number</Label>
                        <Input
                            id="checkout-phone"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0712345678"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Preferred Payment Method</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Payment Method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mpesa">M-Pesa</SelectItem>
                                <SelectItem value="cash">Cash on Delivery</SelectItem>
                                <SelectItem value="bank">Bank Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {paymentMethod !== 'cash' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Payment Instructions</p>
                                {paymentMethod === 'mpesa' ? (
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">Till Number: <span className="text-primary">543210</span></p>
                                        <p className="text-[10px] text-muted-foreground">Go to Lipa na M-Pesa {" > "} Buy Goods & Services</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">Account: <span className="text-primary">1234567890</span></p>
                                        <p className="text-[10px] text-muted-foreground">KCB Bank - Branch: Nairobi - Name: True Dial</p>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="checkout-ref">{paymentMethod === 'mpesa' ? 'M-Pesa Transaction Code' : 'Payment Reference'}</Label>
                                <Input
                                    id="checkout-ref"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder={paymentMethod === 'mpesa' ? "e.g. QXA123456" : "Reference ID"}
                                />
                            </div>
                        </div>
                    )}

                    <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                        {loading ? (
                            <Loader2 className="animate-spin mr-2" />
                        ) : (
                            "Confirm Order"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

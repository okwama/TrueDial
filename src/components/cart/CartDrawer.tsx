
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckoutModal } from "./CheckoutModal";

const CartDrawer = () => {
    const { cart, removeFromCart, total, itemCount } = useCart();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            {itemCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[540px] flex flex-col">
                <SheetHeader>
                    <SheetTitle>Your Cart ({itemCount})</SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1 -mx-6 px-6 my-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            Your cart is empty
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-20 h-20 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">KES {item.price.toLocaleString()}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="pt-4 mt-auto">
                    <Separator className="mb-4" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-lg">KES {total.toLocaleString()}</span>
                    </div>
                    {cart.length > 0 && <CheckoutModal />}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;

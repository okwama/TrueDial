
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tag, Grid, DollarSign, TrendingUp, Clock, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Loader2 } from "lucide-react";

interface Stats {
    totalProducts: number;
    activeProducts: number;
    soldProducts: number;
    totalValue: number;
    totalBrands: number;
    totalCategories: number;
    revenue: number;
    avgOrderValue: number;
    orderCount: number;
    topBrands: { name: string, count: number }[];
}

export const DashboardOverview = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data: products } = await supabase.from("products").select("status, price, brands(name)");
                const { data: brands } = await supabase.from("brands").select("id");
                const { data: categories } = await supabase.from("categories").select("id");
                const { data: orders } = await supabase.from("orders").select("total_amount, payment_status");

                const totalValue = products?.reduce((sum, p) => sum + Number(p.price), 0) || 0;
                const paidOrders = orders?.filter(o => o.payment_status === 'paid') || [];
                const revenue = paidOrders.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
                const avgOrderValue = paidOrders.length > 0 ? revenue / paidOrders.length : 0;

                // Simple top brands calculation
                const brandCounts: Record<string, number> = {};
                products?.forEach(p => {
                    const name = (p.brands as any)?.name || "Unknown";
                    brandCounts[name] = (brandCounts[name] || 0) + 1;
                });
                const topBrands = Object.entries(brandCounts)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 4);

                setStats({
                    totalProducts: products?.length || 0,
                    activeProducts: products?.filter(p => p.status === 'active').length || 0,
                    soldProducts: products?.filter(p => p.status === 'sold').length || 0,
                    totalValue,
                    totalBrands: brands?.length || 0,
                    totalCategories: categories?.length || 0,
                    revenue,
                    avgOrderValue,
                    orderCount: orders?.length || 0,
                    topBrands
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    const mainStats = [
        {
            title: "Total Revenue",
            value: `KES ${stats?.revenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            trend: "+12.5%",
            trendUp: true
        },
        {
            title: "Average Order",
            value: `KES ${stats?.avgOrderValue.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: "+3.2%",
            trendUp: true
        },
        {
            title: "Active Inventory",
            value: stats?.activeProducts,
            icon: Package,
            color: "text-purple-600",
            bg: "bg-purple-50",
            trend: "-2 items",
            trendUp: false
        },
        {
            title: "Total Orders",
            value: stats?.orderCount,
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-50",
            trend: "+5 today",
            trendUp: true
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Executive Summary</h2>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Business performance and inventory health.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Current Date</p>
                    <p className="text-sm font-semibold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mainStats.map((card) => (
                    <Card key={card.title} className="border-none shadow-sm shadow-slate-200/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {card.title}
                            </CardTitle>
                            <div className={`${card.bg} p-2 rounded-lg`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{card.value}</div>
                            <div className="flex items-center mt-1 text-[10px] font-bold">
                                {card.trendUp ? (
                                    <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 text-rose-500 mr-1" />
                                )}
                                <span className={card.trendUp ? "text-emerald-500" : "text-rose-500"}>
                                    {card.trend}
                                </span>
                                <span className="text-slate-400 ml-1">vs last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inventory Value Card */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Inventory Valuation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex flex-col justify-center bg-slate-50 rounded-xl p-8 border border-slate-100">
                            <p className="text-sm text-slate-500 font-medium">Estimated Retail Value</p>
                            <h3 className="text-4xl font-black text-slate-900 mt-2">
                                KES {stats?.totalValue.toLocaleString()}
                            </h3>
                            <div className="mt-6 flex gap-4">
                                <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Products</p>
                                    <p className="text-lg font-bold">{stats?.totalProducts}</p>
                                </div>
                                <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Brands</p>
                                    <p className="text-lg font-bold">{stats?.totalBrands}</p>
                                </div>
                                <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Categories</p>
                                    <p className="text-lg font-bold">{stats?.totalCategories}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Brands Card */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Top Brands</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats?.topBrands.map((brand, i) => (
                                <div key={brand.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                                            {i + 1}
                                        </div>
                                        <span className="font-semibold text-slate-700">{brand.name}</span>
                                    </div>
                                    <Badge variant="secondary" className="font-mono text-xs">
                                        {brand.count} items
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const Badge = ({ children, className, variant }: any) => (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${className} ${variant === 'secondary' ? 'bg-slate-100 text-slate-600' : ''}`}>
        {children}
    </span>
);

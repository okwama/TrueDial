
import {
    LayoutDashboard,
    Package,
    Tag,
    Grid,
    Settings,
    ShoppingBag,
    LogOut,
    Menu,
    X,
    Globe,
    Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
}

const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "import", label: "Bulk Import", icon: Database },
    { id: "brands", label: "Brands", icon: Tag },
    { id: "categories", label: "Categories", icon: Grid },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "view-site", label: "View Website", icon: Globe, isLink: true },
];

export const AdminSidebar = ({ activeTab, setActiveTab, onLogout }: AdminSidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const handleAction = (item: any) => {
        if (item.isLink) {
            window.open("/", "_blank");
            return;
        }
        setActiveTab(item.id);
    };

    return (
        <aside className={cn(
            "bg-slate-900 text-white min-h-screen transition-all duration-300 flex flex-col sticky top-0",
            collapsed ? "w-20" : "w-64"
        )}>
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-800">
                {!collapsed && (
                    <span className="font-bold text-lg tracking-tight whitespace-nowrap">TRUE DIAL ADMIN</span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 hover:bg-slate-800 rounded transition-colors"
                >
                    {collapsed ? <Menu size={20} /> : <X size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleAction(item)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-sm font-medium relative group",
                            activeTab === item.id
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "text-slate-400 hover:text-white hover:bg-slate-800",
                            item.isLink && "mt-12 border-t border-slate-800 rounded-none pt-6"
                        )}
                    >
                        <item.icon size={20} className="shrink-0" />
                        {!collapsed && <span>{item.label}</span>}

                        {/* Tooltip for collapsed mode */}
                        {collapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                {item.label}
                            </div>
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
                <Button
                    variant="ghost"
                    onClick={onLogout}
                    className={cn(
                        "w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10 gap-3",
                        collapsed && "px-0 justify-center"
                    )}
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </Button>
            </div>
        </aside>
    );
};

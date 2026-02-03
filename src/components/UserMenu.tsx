
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User, LogOut, Gift, LayoutDashboard } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export const UserMenu = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user.id);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user.id);
            else setProfile(null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
        setProfile(data);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    if (!user) {
        return (
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                <User className="w-4 h-4 mr-2" />
                Sign In
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{profile?.full_name || "User"}</span>
                    {profile?.loyalty_points > 0 && (
                        <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            <Gift className="w-3 h-3" />
                            {profile.loyalty_points}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex justify-between">
                    <span>Loyalty Points</span>
                    <span className="font-bold">{profile?.loyalty_points || 0}</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>Order History (Coming Soon)</DropdownMenuItem>
                {profile?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Admin Dashboard
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

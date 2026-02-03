
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success("Check your email for the confirmation link!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success("Welcome back!");
                navigate(-1); // Go back to previous page
            }
        } catch (error: any) {
            console.error("Auth error details:", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email address first");
            return;
        }

        setResetLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            toast.success("Password reset link sent to your email!");
        } catch (error: any) {
            toast.error(error.message || "Failed to send reset link");
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex items-center justify-center min-h-[80vh] px-4">
                <Card className="w-full max-w-md mt-20">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
                        <CardDescription>
                            {isSignUp ? "Join True Dial to earn loyalty points" : "Access your account and points"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAuth} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {!isSignUp && (
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            disabled={resetLoading}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            {resetLoading ? "Sending..." : "Forgot password?"}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="underline hover:text-primary"
                                >
                                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;

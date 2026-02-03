
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Message sent! We'll get back to you soon.");
        // In a real app, this would send data to a backend
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-20">
                {/* Hero */}
                <section className="section-padding">
                    <div className="section-container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl"
                        >
                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                                Contact Us
                            </p>
                            <h1 className="text-hero mb-6">Get in Touch</h1>
                            <p className="text-subhero text-muted-foreground">
                                Questions about a watch? Want to sell one? We're here to help.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="section-padding border-t border-border">
                    <div className="section-container">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                            {/* Direct Contact Info */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-2xl font-serif mb-6">Direct Channels</h3>
                                    <div className="flex flex-col gap-4">
                                        <Button asChild size="lg" className="justify-start gap-3 w-full sm:w-auto">
                                            <a
                                                href="https://wa.me/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                                Chat on WhatsApp (Fastest)
                                            </a>
                                        </Button>
                                        <Button variant="outline" size="lg" asChild className="justify-start gap-3 w-full sm:w-auto">
                                            <a href="mailto:contact@truedial.com">
                                                <Mail className="w-5 h-5" />
                                                Email Us
                                            </a>
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                                        <div>
                                            <h4 className="font-medium">Location</h4>
                                            <p className="text-muted-foreground">Nairobi, Kenya 🇰🇪</p>
                                            <p className="text-xs text-muted-foreground mt-1">Delivery nationwide.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-muted/30 p-6 rounded-lg border border-border">
                                    <h4 className="font-serif text-lg mb-2">FAQ</h4>
                                    <div className="space-y-4 text-sm text-muted-foreground">
                                        <div>
                                            <p className="font-medium text-foreground">Do you deliver?</p>
                                            <p>Yes, we offer nationwide delivery via trusted courier partners.</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Are the watches authentic?</p>
                                            <p>Absolutely. Every watch is inspected and guaranteed authentic.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Message Form */}
                            <div>
                                <Card>
                                    <CardContent className="p-6 md:p-8">
                                        <h3 className="text-2xl font-serif mb-6">Send a Message</h3>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                                <Input id="name" placeholder="Your name" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                                <Input id="email" type="email" placeholder="your@email.com" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="message" className="text-sm font-medium">Message</label>
                                                <Textarea id="message" placeholder="How can we help?" className="min-h-[150px]" required />
                                            </div>
                                            <Button type="submit" className="w-full">
                                                Send Message
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;

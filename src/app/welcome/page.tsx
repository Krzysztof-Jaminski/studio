
'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Briefcase, FileText, ShoppingCart, Users, CheckCircle } from "lucide-react";
import { Logo } from "@/components/icons";
import React, { useState } from "react";
import Login from "@/components/login";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
    <motion.div 
        className="p-8 rounded-lg bg-card/50 backdrop-blur-sm border border-border/20 flex flex-col items-center text-center shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        whileHover={{ 
            translateY: -5, 
            boxShadow: "0px 10px 20px rgba(91, 33, 182, 0.2)",
            transition: { duration: 0.2 }
        }}
    >
        <div className="p-3 rounded-full bg-primary/10 mb-4 text-primary">
            {icon}
        </div>
        <h3 className="text-xl font-bold font-headline mb-2 text-white">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </motion.div>
);

export default function WelcomePage() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <motion.div 
            className="min-h-screen w-full flex flex-col items-center justify-center bg-transparent text-foreground p-4 overflow-hidden"
            initial="initial"
            animate="animate"
        >
            <div className="container mx-auto px-4 py-12 z-10">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <Logo className="h-20 w-20 mx-auto mb-4 text-primary drop-shadow-lg" />
                    <h1 className="text-5xl md:text-6xl font-bold font-headline mb-2 text-gradient drop-shadow-md">Witaj w PraktykanciHub!</h1>
                    <p className="text-lg md:text-xl text-muted-foreground">Twoje centrum do zarządzania praktykami.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <FeatureCard
                        icon={<Briefcase className="h-8 w-8" />}
                        title="Rezerwacje Obecności"
                        description="Zaplanuj swoje dni w biurze lub online. Zobacz, kto jeszcze będzie i zarezerwuj miejsce."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<FileText className="h-8 w-8" />}
                        title="Statusy i Portfolio"
                        description="Dziel się tygodniowymi postępami i buduj swoje portfolio projektów, aby pokazać swoje osiągnięcia."
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={<ShoppingCart className="h-8 w-8" />}
                        title="Zamówienia Jedzenia"
                        description="Organizuj grupowe zamówienia na lunch. Dołącz do istniejących lub twórz własne wydarzenia."
                        delay={0.6}
                    />
                    <FeatureCard
                        icon={<Users className="h-8 w-8" />}
                        title="Społeczność"
                        description="Przeglądaj profile innych praktykantów i bądź na bieżąco z życiem firmy."
                        delay={0.8}
                    />
                </div>
                
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 1.0 }}
                    className="text-center"
                >
                    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" variant="glass" className="shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <CheckCircle className="mr-2"/> Rozpocznij
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                           <Login />
                        </DialogContent>
                    </Dialog>
                </motion.div>
            </div>
        </motion.div>
    );
}

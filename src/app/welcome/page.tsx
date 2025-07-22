
'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Briefcase, FileText, ShoppingCart, Users, CheckCircle } from "lucide-react";
import { Logo } from "@/components/icons";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <motion.div 
        className="p-6 rounded-lg bg-card border flex flex-col items-center text-center"
        whileHover={{ translateY: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    >
        <div className="p-3 rounded-full bg-primary/10 mb-4 text-primary">
            {icon}
        </div>
        <h3 className="text-xl font-bold font-headline mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </motion.div>
);

export default function WelcomePage({ onDone }: { onDone: () => void }) {
    return (
        <motion.div 
            className="min-h-screen bg-background text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <Logo className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-2">Witaj w PraktykanciHub!</h1>
                    <p className="text-lg md:text-xl text-muted-foreground">Twoim centrum do zarządzania praktykami.</p>
                </motion.div>

                <motion.div 
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    initial="hidden"
                    animate="visible"
                >
                    <FeatureCard
                        icon={<Briefcase className="h-8 w-8" />}
                        title="Rezerwacje Obecności"
                        description="Zaplanuj swoje dni w biurze lub online. Zobacz, kto jeszcze będzie i zarezerwuj miejsce."
                    />
                    <FeatureCard
                        icon={<FileText className="h-8 w-8" />}
                        title="Statusy i Portfolio"
                        description="Dziel się tygodniowymi postępami i buduj swoje portfolio projektów, aby pokazać swoje osiągnięcia."
                    />
                     <FeatureCard
                        icon={<ShoppingCart className="h-8 w-8" />}
                        title="Zamówienia Jedzenia"
                        description="Organizuj grupowe zamówienia na lunch. Dołącz do istniejących lub twórz własne wydarzenia."
                    />
                    <FeatureCard
                        icon={<Users className="h-8 w-8" />}
                        title="Społeczność"
                        description="Przeglądaj profile innych praktykantów i bądź na bieżąco z życiem firmy."
                    />
                </motion.div>
                
                <motion.div
                     initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="text-center"
                >
                    <Button size="lg" onClick={onDone} className="bg-orange-500 hover:bg-orange-600 text-white">
                        <CheckCircle className="mr-2"/> Rozpocznij
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}

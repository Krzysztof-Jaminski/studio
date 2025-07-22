
'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Briefcase, FileText, ShoppingCart, Users, CheckCircle } from "lucide-react";
import { Logo } from "@/components/icons";

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
    <motion.div 
        className="p-6 rounded-lg bg-card/80 backdrop-blur-sm border border-white/20 flex flex-col items-center text-center text-white shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
        whileHover={{ translateY: -8, boxShadow: "0px 15px 25px rgba(0,0,0,0.3)" }}
    >
        <div className="p-3 rounded-full bg-white/10 mb-4 text-white">
            {icon}
        </div>
        <h3 className="text-xl font-bold font-headline mb-2">{title}</h3>
        <p className="text-white/80">{description}</p>
    </motion.div>
);

export default function WelcomePage({ onDone }: { onDone: () => void }) {
    return (
        <motion.div 
            className="min-h-screen w-full flex flex-col items-center justify-center text-foreground p-4 overflow-hidden relative"
            initial="initial"
            animate="animate"
        >
             <motion.div 
                className="absolute inset-0 z-0"
                variants={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1, transition: { duration: 1.5 } }
                }}
             >
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-orange-500" />
                 <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-transparent to-yellow-500"
                    animate={{ 
                        x: ['-100%', '100%'], 
                        y: ['50%', '-50%'],
                        rotate: [0, 180],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut'
                    }}
                 />
             </motion.div>


            <div className="container mx-auto px-4 py-12 relative z-10">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <Logo className="h-20 w-20 mx-auto mb-4 text-white drop-shadow-lg" />
                    <h1 className="text-5xl md:text-6xl font-bold font-headline mb-2 text-white drop-shadow-md">Witaj w PraktykanciHub!</h1>
                    <p className="text-lg md:text-xl text-white/90">Twoje centrum do zarządzania praktykami.</p>
                </motion.div>

                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <FeatureCard
                        icon={<Briefcase className="h-8 w-8" />}
                        title="Rezerwacje Obecności"
                        description="Zaplanuj swoje dni w biurze lub online. Zobacz, kto jeszcze będzie i zarezerwuj miejsce."
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={<FileText className="h-8 w-8" />}
                        title="Statusy i Portfolio"
                        description="Dziel się tygodniowymi postępami i buduj swoje portfolio projektów, aby pokazać swoje osiągnięcia."
                        delay={0.6}
                    />
                     <FeatureCard
                        icon={<ShoppingCart className="h-8 w-8" />}
                        title="Zamówienia Jedzenia"
                        description="Organizuj grupowe zamówienia na lunch. Dołącz do istniejących lub twórz własne wydarzenia."
                        delay={0.8}
                    />
                    <FeatureCard
                        icon={<Users className="h-8 w-8" />}
                        title="Społeczność"
                        description="Przeglądaj profile innych praktykantów i bądź na bieżąco z życiem firmy."
                        delay={1.0}
                    />
                </div>
                
                <motion.div
                     initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 1.2 }}
                    className="text-center"
                >
                    <Button size="lg" onClick={onDone} className="bg-white text-primary hover:bg-white/90 shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <CheckCircle className="mr-2"/> Rozpocznij
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}

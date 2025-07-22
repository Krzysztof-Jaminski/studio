
'use client';

import { motion } from "framer-motion";

const AnimatedSquare = ({ size, initialX, initialY, duration, delay = 0 }: { size: number, initialX: string, initialY: string, duration: number, delay?: number }) => (
    <motion.div
        style={{
            width: size,
            height: size,
            position: 'absolute',
            top: initialY,
            left: initialX,
            backgroundColor: 'hsla(var(--primary) / 0.1)',
            borderRadius: '15px',
            filter: 'blur(10px)',
        }}
        initial={{ opacity: 0, y: 50, rotate: 0 }}
        animate={{
            opacity: [0, 0.5, 0],
            y: [50, -50, 50],
            x: [0, 20, -20, 0],
            rotate: [0, 90, 180],
        }}
        transition={{
            duration: duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: delay,
        }}
    />
);

export default function AnimatedBackground() {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
             {/* Static glows */}
            <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vw] bg-gradient-to-tl from-blue-500/20 to-purple-600/20 rounded-full filter blur-3xl opacity-50 animate-pulse delay-1000"></div>

            {/* Animated squares */}
            <AnimatedSquare size={250} initialX="5%" initialY="15%" duration={25} />
            <AnimatedSquare size={200} initialX="85%" initialY="10%" duration={22} />
            <AnimatedSquare size={300} initialX="10%" initialY="70%" duration={28} />
            <AnimatedSquare size={220} initialX="90%" initialY="80%" duration={20} />
            <AnimatedSquare size={180} initialX="50%" initialY="50%" duration={30} />
            <AnimatedSquare size={170} initialX="30%" initialY="30%" duration={18} />
            <AnimatedSquare size={280} initialX="70%" initialY="60%" duration={26} />
            <AnimatedSquare size={150} initialX="20%" initialY="80%" duration={23} />
            <AnimatedSquare size={190} initialX="80%" initialY="40%" duration={21} />
        </div>
    );
}

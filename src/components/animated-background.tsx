
'use client';

import { motion } from "framer-motion";

const AnimatedSquare = ({
    size,
    initialX,
    initialY,
    duration,
    delay = 0
}: {
    size: number,
    initialX: string,
    initialY: string,
    duration: number,
    delay?: number
}) => (
    <motion.div
        style={{
            width: size,
            height: size,
            position: 'absolute',
            top: initialY,
            left: initialX,
            backgroundColor: 'hsla(var(--primary) / var(--bg-square-opacity))',
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
            <div
                className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] rounded-full filter blur-3xl animate-pulse"
                style={{ background: 'radial-gradient(circle, hsla(var(--primary) / var(--bg-glow-opacity)), transparent 60%)'}}
            ></div>
            <div 
                className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vw] rounded-full filter blur-3xl animate-pulse delay-1000"
                style={{ background: 'radial-gradient(circle, hsla(var(--accent) / var(--bg-glow-opacity)), transparent 60%)'}}
            ></div>

            {/* Animated squares */}
            {/* Large and slow */}
            <AnimatedSquare size={350} initialX="5%" initialY="15%" duration={35} />
            <AnimatedSquare size={300} initialX="85%" initialY="10%" duration={32} />
            <AnimatedSquare size={400} initialX="10%" initialY="70%" duration={38} />
            <AnimatedSquare size={320} initialX="90%" initialY="80%" duration={30} />
            
            {/* Medium */}
            <AnimatedSquare size={180} initialX="50%" initialY="50%" duration={25} delay={1}/>
            <AnimatedSquare size={170} initialX="30%" initialY="30%" duration={22} />
            <AnimatedSquare size={280} initialX="70%" initialY="60%" duration={28} delay={2}/>
            
            {/* Small and fast */}
            <AnimatedSquare size={80} initialX="20%" initialY="80%" duration={15} />
            <AnimatedSquare size={100} initialX="80%" initialY="40%" duration={18} delay={1.5} />
             <AnimatedSquare size={90} initialX="40%" initialY="10%" duration={16} />
        </div>
    );
}

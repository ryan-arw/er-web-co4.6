'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface AnimatedLogoProps {
    size?: number;
    className?: string;
}

export default function AnimatedLogo({ size = 40, className = '' }: AnimatedLogoProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={`relative cursor-pointer ${className}`}
            style={{ width: size, height: size }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Glow ring */}
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(227,135,30,0.3) 0%, transparent 70%)',
                }}
                animate={{
                    scale: isHovered ? 1.6 : 1,
                    opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.4 }}
            />

            {/* Pulse ring */}
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-warm-orange/30"
                animate={{
                    scale: isHovered ? [1, 1.8] : 1,
                    opacity: isHovered ? [0.6, 0] : 0,
                }}
                transition={{
                    duration: 1.2,
                    repeat: isHovered ? Infinity : 0,
                    ease: 'easeOut',
                }}
            />

            {/* Rotating orbit dots */}
            {isHovered && (
                <>
                    {[0, 120, 240].map((angle) => (
                        <motion.div
                            key={angle}
                            className="absolute w-1.5 h-1.5 rounded-full bg-warm-orange"
                            style={{
                                top: '50%',
                                left: '50%',
                                marginTop: -3,
                                marginLeft: -3,
                            }}
                            animate={{
                                rotate: [angle, angle + 360],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        >
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    transform: `translateY(-${size * 0.7}px)`,
                                }}
                                className="w-1.5 h-1.5 rounded-full bg-warm-orange/60"
                            />
                        </motion.div>
                    ))}
                </>
            )}

            {/* Main logo */}
            <motion.div
                className="relative w-full h-full"
                animate={{
                    rotate: isHovered ? [0, 5, -5, 0] : 0,
                }}
                transition={{
                    duration: 0.6,
                    ease: 'easeInOut',
                }}
            >
                <Image
                    src="/photo/ezyrelife-logo-round.png"
                    alt="EzyRelife"
                    fill
                    className="object-contain"
                    priority
                />
            </motion.div>
        </motion.div>
    );
}

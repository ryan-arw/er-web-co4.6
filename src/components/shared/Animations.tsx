'use client';

import { motion, useInView, type Variants } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

// ═══ Shared Animation Variants ═══

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const slideInRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// ═══ Scroll-Triggered Animated Section ═══

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
    variants?: Variants;
    margin?: string;
}

export function AnimatedSection({
    children,
    className = '',
    id,
    variants = staggerContainer,
    margin = '-80px',
}: AnimatedSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: margin as `${number}px` });

    return (
        <motion.section
            ref={ref}
            id={id}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={variants}
            className={className}
        >
            {children}
        </motion.section>
    );
}

// ═══ Animated Div (for individual elements) ═══

interface AnimatedDivProps {
    children: ReactNode;
    className?: string;
    variants?: Variants;
    delay?: number;
}

export function AnimatedDiv({ children, className = '', variants = fadeUp, delay = 0 }: AnimatedDivProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' as `${number}px` });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={variants}
            custom={delay}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ═══ Page Transition Wrapper ═══

export function PageTransition({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ═══ Hover Scale ═══

export function HoverScale({ children, className = '', scale = 1.02 }: { children: ReactNode; className?: string; scale?: number }) {
    return (
        <motion.div
            whileHover={{ scale }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ═══ Animated Counter ═══

export function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
    return (
        <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                {prefix}{value}{suffix}
            </motion.span>
        </motion.span>
    );
}

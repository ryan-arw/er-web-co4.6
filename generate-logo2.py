import os
import re

cur_dir = os.path.dirname(os.path.abspath(__file__))
svg_path = os.path.join(cur_dir, 'public/ezyrelife-logo.svg')
out_path = os.path.join(cur_dir, 'src/components/shared/AdvancedSvgLogo.tsx')

with open(svg_path, 'r', encoding='utf-8') as f:
    svg_content = f.read()

# Replace tags to motion.
svg_content = svg_content.replace('<polyline ', '<motion.polyline ')
svg_content = svg_content.replace('</polyline>', '</motion.polyline>')
svg_content = svg_content.replace('<polygon ', '<motion.polygon ')
svg_content = svg_content.replace('</polygon>', '</motion.polygon>')
svg_content = re.sub(r'fill="#(.*?)"', r'fill="#\1"', svg_content)
svg_content = re.sub(r'<title>.*?</title>', '', svg_content)

def extract_group(id_str):
    if id_str == 'ER_dot':
        m = re.search(r'(<motion.polygon id="ER_dot".*?/>)', svg_content, re.DOTALL)
        return m.group(1) if m else ''
    if id_str == 'ER':
        m = re.search(r'(<motion.polyline id="ER".*?/>)', svg_content, re.DOTALL)
        return m.group(1) if m else ''
    
    m = re.search(rf'<g id="{id_str}".*?>(.*?)</g>', svg_content, re.DOTALL)
    if m:
        return m.group(1)
    return ''

lines_3 = extract_group('lines_3')
lines_2 = extract_group('lines_2')
lines_1 = extract_group('lines_1')
er_dot = extract_group('ER_dot')
er = extract_group('ER')

react_code = """'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform, useAnimation } from 'framer-motion';

export interface AdvancedSvgLogoProps {
    variant?: 'static' | 'draw' | 'parallax' | 'pulse' | 'theme' | 'morph' | 'glitch' | 'liquid' | 'explosion';
    morphProgress?: number; // 0 to 1
    className?: string;
}

export default function AdvancedSvgLogo({ variant = 'static', morphProgress = 0, className = '' }: AdvancedSvgLogoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const controls = useAnimation();

    // Reset animations if variant changes
    useEffect(() => {
        if (variant === 'draw') {
            controls.set("hidden");
            controls.start("visible");
        }
    }, [variant, controls]);

    // Parallax & Explosion Mouse handling
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!['parallax', 'explosion'].includes(variant)) return;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        // Increase the multiplier to make the parallax clearly visible
        // x is between -1 and 1
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        setMousePosition({ x: 0, y: 0 });
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    // Springs for smooth mouse follow
    const springX = useSpring(mousePosition.x, { stiffness: 150, damping: 15 });
    const springY = useSpring(mousePosition.y, { stiffness: 150, damping: 15 });

    // Morph Logic 
    // morphProgress: 0 (full logo), 1 (minimal logo - only ER and ER_dot visible)
    const morphOpacity = 1 - morphProgress * 1.5; // Fades out completely before 1
    const morphScale = 1 + (morphProgress * 0.5); // Zooms into the center ER

    const drawItem = {
        hidden: { pathLength: 0, fillOpacity: 0, strokeOpacity: 1, strokeWidth: 8 },
        visible: {
            pathLength: 1,
            fillOpacity: 1,
            strokeOpacity: 0,
            transition: {
                pathLength: { delay: 0.1, type: "spring", duration: 3, bounce: 0 },
                fillOpacity: { delay: 2, duration: 1 },
                strokeOpacity: { delay: 2, duration: 1 }
            }
        }
    };

    // Explosion Effect (scatter parts away from center)
    const getExplosionStyle = (layerIndex: number, angleOffset: number) => {
        if (variant !== 'explosion' || !isHovered) return { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };
        const distance = layerIndex * 150; 
        const rad = (angleOffset * Math.PI) / 180;
        return {
            x: Math.cos(rad) * distance,
            y: Math.sin(rad) * distance,
            rotate: angleOffset * 0.5,
            scale: 1 - layerIndex * 0.1,
            opacity: 0.5 + (1 - layerIndex) * 0.5,
            transition: { type: 'spring', stiffness: 100, damping: 10 }
        };
    };

    const getVariantProps = (id: string, layerIndex: number = 0, angle: number = 0) => {
        if (variant === 'draw') {
            return {
                variants: drawItem,
                initial: "hidden",
                animate: controls,
                stroke: id === 'lines_1' ? '#b7da80' : id === 'lines_2' ? '#fff1a1' : id === 'lines_3' ? '#f7c87f' : id==='ER_dot'?'#f3723e':'#ffffff'
            };
        }
        if (variant === 'pulse') {
             if (id === 'ER_dot' || id === 'ER') {
                 return {
                     animate: {
                         filter: ['drop-shadow(0px 0px 0px rgba(243,114,62,0))', 'drop-shadow(0px 0px 30px rgba(243,114,62,1))', 'drop-shadow(0px 0px 0px rgba(243,114,62,0))'],
                         scale: [1, 1.05, 1],
                     },
                     style: { transformOrigin: "50% 50%" },
                     transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                 }
             }
        }
        if (variant === 'glitch') {
            // Apply a rapid shake to lines_3 and lines_1 on hover
            if (isHovered && (id === 'lines_3' || id === 'lines_1')) {
                return {
                    animate: {
                        x: [0, -10, 10, -5, 5, 0],
                        y: [0, 5, -5, 10, -10, 0],
                        skewX: [0, 20, -20, 0],
                    },
                    transition: { duration: 0.2, repeat: Infinity, repeatType: "mirror" }
                }
            }
        }
        if (variant === 'explosion') {
            return {
                animate: getExplosionStyle(layerIndex, angle)
            };
        }
        return {};
    };

    const getLayerStyle = (layerIndex: number) => {
        if (variant !== 'parallax') return {};
        // Shift values: using spring * magnitude
        return {
            x: useTransform(springX, value => value * layerIndex * 40), // 40px shift
            y: useTransform(springY, value => value * layerIndex * 40),
        };
    };

    const baseSVG = (
        <>
            {variant === 'liquid' && (
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            )}
            {/* The viewBox is strictly centered so transforms work intuitively */}
            <motion.g id="lines_3" data-name="lines 3" style={{...getLayerStyle(1.2), transformOrigin: 'center center'}} {...getVariantProps('lines_3', 3, 45)} opacity={variant === 'morph' ? Math.max(0, morphOpacity) : 1}>
                <!-- injected path 1 -->
            </motion.g>
            <motion.g id="lines_2" data-name="lines 2" style={{...getLayerStyle(0.8), transformOrigin: 'center center'}} {...getVariantProps('lines_2', 2, -135)} opacity={variant === 'morph' ? Math.max(0, morphOpacity) : 1}>
                <!-- injected path 2 -->
            </motion.g>
            <motion.g id="lines_1" data-name="lines 1" style={{...getLayerStyle(0.4), transformOrigin: 'center center'}} {...getVariantProps('lines_1', 1, 90)} opacity={variant === 'morph' ? Math.max(0, morphOpacity) : 1}>
                <!-- injected path 3 -->
            </motion.g>
            
            <motion.g id="ER_dot" data-name="ER dot" style={{...getLayerStyle(2), transformOrigin: 'center center'}} {...getVariantProps('ER_dot', 0.5, 0)}>
                <!-- injected ER_dot -->
            </motion.g>
            <motion.g id="ER" data-name="ER" style={{...getLayerStyle(2), transformOrigin: 'center center'}} {...getVariantProps('ER', 0, 0)}>
                <!-- injected ER -->
            </motion.g>
        </>
    );

    return (
        <motion.div
            ref={containerRef}
            className={`relative flex items-center justify-center ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={variant === 'morph' ? { scale: morphScale } : {}}
            {...(variant === 'pulse' ? {
                whileHover: { scale: 1.1 },
                transition: { type: 'spring', stiffness: 300, damping: 20 }
            } : {})}
        >
            {variant === 'glitch' && isHovered && (
                <>
                {/* Cyan Glitch layer */}
                <svg viewBox="0 0 992.13 992.13" className="absolute inset-0 w-full h-full mix-blend-screen opacity-70" style={{ transform: 'translate(10px, -5px)', filter: 'hue-rotate(-90deg) saturate(3)' }}>{baseSVG}</svg>
                {/* Red Glitch layer */}
                <svg viewBox="0 0 992.13 992.13" className="absolute inset-0 w-full h-full mix-blend-screen opacity-70" style={{ transform: 'translate(-10px, 5px)', filter: 'hue-rotate(90deg) saturate(3)' }}>{baseSVG}</svg>
                </>
            )}

            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 992.13 992.13" 
                className={`w-full h-full ${variant === 'liquid' && isHovered ? 'animate-pulse' : ''}`}
                style={{ 
                    overflow: 'visible',
                    ...(variant === 'theme' ? { filter: 'saturate(2) hue-rotate(15deg) contrast(1.2)' } : {}),
                    ...(variant === 'liquid' && isHovered ? { filter: 'url(#goo)' } : {})
                }}
            >
                {baseSVG}
            </svg>
        </motion.div>
    );
}
"""

react_code = react_code.replace('<!-- injected path 1 -->', lines_3)
react_code = react_code.replace('<!-- injected path 2 -->', lines_2)
react_code = react_code.replace('<!-- injected path 3 -->', lines_1)
react_code = react_code.replace('<!-- injected ER_dot -->', er_dot)
react_code = react_code.replace('<!-- injected ER -->', er)

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(react_code)

print("AdvancedSvgLogo generated Successfully.")

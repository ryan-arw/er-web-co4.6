import os
import re

cur_dir = os.path.dirname(os.path.abspath(__file__))
svg_path = os.path.join(cur_dir, 'public/ezyrelife-logo.svg')
out_path = os.path.join(cur_dir, 'src/components/shared/AdvancedSvgLogo.tsx')

with open(svg_path, 'r', encoding='utf-8') as f:
    svg_content = f.read()

# Replace tags
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
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface AdvancedSvgLogoProps {
    variant?: 'static' | 'draw' | 'parallax' | 'pulse' | 'theme' | 'morph';
    className?: string;
}

export default function AdvancedSvgLogo({ variant = 'static', className = '' }: AdvancedSvgLogoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if(variant !== 'parallax') return;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 10;
        const y = (e.clientY - rect.top - rect.height / 2) / 10;
        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        if(variant !== 'parallax') return;
        setMousePosition({ x: 0, y: 0 });
    };

    const springX = useSpring(mousePosition.x, { stiffness: 100, damping: 15 });
    const springY = useSpring(mousePosition.y, { stiffness: 100, damping: 15 });

    const { scrollY } = useScroll();
    const morphOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const morphScale = useTransform(scrollY, [0, 300], [1, 0.8]);

    const drawItem = {
        hidden: { pathLength: 0, fillOpacity: 0, strokeOpacity: 1, strokeWidth: 5 },
        visible: (i: number) => ({
            pathLength: 1,
            fillOpacity: 1,
            strokeOpacity: 0,
            transition: {
                pathLength: { delay: 0.1, type: "spring", duration: 3, bounce: 0 },
                fillOpacity: { delay: 2, duration: 1 },
                strokeOpacity: { delay: 2, duration: 1 }
            }
        })
    };

    const getVariantProps = (id: string) => {
        if (variant === 'draw') {
            return {
                variants: drawItem,
                initial: "hidden",
                animate: "visible",
                stroke: id === 'lines_1' ? '#b7da80' : id === 'lines_2' ? '#fff1a1' : id === 'lines_3' ? '#f7c87f' : '#f3723e'
            };
        }
        if (variant === 'pulse') {
             if (id === 'ER_dot' || id === 'ER') {
                 return {
                     animate: {
                         filter: ['drop-shadow(0px 0px 0px rgba(243,114,62,0))', 'drop-shadow(0px 0px 20px rgba(243,114,62,1))', 'drop-shadow(0px 0px 0px rgba(243,114,62,0))'],
                         scale: [1, 1.05, 1],
                         transformOrigin: "center"
                     },
                     transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                 }
             }
        }
        return {};
    };

    const getLayerStyle = (layerIndex: number) => {
        if (variant !== 'parallax') return {};
        return {
            x: useTransform(springX, value => value * layerIndex),
            y: useTransform(springY, value => value * layerIndex),
        };
    };

    const renderSVG = () => (
        <svg 
            id="Layer_1" 
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 992.13 992.13" 
            className="w-full h-full"
            style={{ 
                overflow: 'visible',
                ...(variant === 'theme' ? { filter: 'saturate(2) hue-rotate(15deg)' } : {}) 
            }}
        >
            <motion.g id="lines_3" data-name="lines 3" style={getLayerStyle(0.5)} {...getVariantProps('lines_3')} opacity={variant === 'morph' ? morphOpacity : 1}>
                <!-- injected path 1 -->
            </motion.g>
            <motion.g id="lines_2" data-name="lines 2" style={getLayerStyle(1)} {...getVariantProps('lines_2')} opacity={variant === 'morph' ? morphOpacity : 1}>
                <!-- injected path 2 -->
            </motion.g>
            <motion.g id="lines_1" data-name="lines 1" style={getLayerStyle(1.5)} {...getVariantProps('lines_1')} opacity={variant === 'morph' ? morphOpacity : 1}>
                <!-- injected path 3 -->
            </motion.g>
            <motion.g id="ER_dot" data-name="ER dot" style={getLayerStyle(2.5)} {...getVariantProps('ER_dot')}>
                <!-- injected ER_dot -->
            </motion.g>
            <motion.g id="ER" data-name="ER" style={getLayerStyle(2.5)} {...getVariantProps('ER')}>
                <!-- injected ER -->
            </motion.g>
        </svg>
    );

    return (
        <motion.div
            ref={containerRef}
            className={`relative flex items-center justify-center ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={variant === 'morph' ? { scale: morphScale } : {}}
            {...(variant === 'pulse' ? {
                whileHover: { scale: 1.1 },
                transition: { type: 'spring', stiffness: 300, damping: 20 }
            } : {})}
        >
            {renderSVG()}
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

print("Generated Component Successfully.")

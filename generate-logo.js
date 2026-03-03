const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../public/ezyrelife-logo.svg');
const outPath = path.join(__dirname, '../src/components/shared/AdvancedSvgLogo.tsx');

let svgContent = fs.readFileSync(svgPath, 'utf8');

// The original svg contains polyline and polygon tags. We'll replace them with motion.polyline and motion.polygon
svgContent = svgContent.replace(/<polyline /g, '<motion.polyline ');
svgContent = svgContent.replace(/<\/polyline>/g, '</motion.polyline>');
svgContent = svgContent.replace(/<polygon /g, '<motion.polygon ');
svgContent = svgContent.replace(/<\/polygon>/g, '</motion.polygon>');
svgContent = svgContent.replace(/<svg /g, '<svg ');
svgContent = svgContent.replace(/<\/svg>/g, '</svg>');
svgContent = svgContent.replace(/data-name/g, 'data-name');
svgContent = svgContent.replace(/fill="#(.*?)"/g, (match, color) => {
    return `fill="#${color}"`;
});

// Remove <title>er logo 02</title>
svgContent = svgContent.replace(/<title>.*?<\/title>/, '');

const componentCode = `
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface AdvancedSvgLogoProps {
    variant?: 'static' | 'draw' | 'parallax' | 'pulse' | 'theme' | 'morph';
    className?: string;
}

export default function AdvancedSvgLogo({ variant = 'static', className = '' }: AdvancedSvgLogoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // For Parallax
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

    // For scroll-driven morph
    const { scrollY } = useScroll();
    const morphOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const morphScale = useTransform(scrollY, [0, 300], [1, 0.8]);

    // For draw variant (animation variants)
    const drawItem = {
        hidden: { pathLength: 0, fillOpacity: 0, strokeOpacity: 1, strokeWidth: 5 },
        visible: (i: number) => ({
            pathLength: 1,
            fillOpacity: 1,
            strokeOpacity: 0,
            transition: {
                pathLength: { delay: 0.1, type: "spring", duration: 2, bounce: 0 },
                fillOpacity: { delay: 1.5, duration: 1 },
                strokeOpacity: { delay: 1.5, duration: 1 }
            }
        })
    };

    // Helper to generate props dynamically based on variant
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

    // For Parallax individual layer offsets
    const getLayerStyle = (layerIndex: number) => {
        if (variant !== 'parallax') return {};
        return {
            x: useTransform(springX, value => value * layerIndex),
            y: useTransform(springY, value => value * layerIndex),
        };
    };

    // The raw SVG modified for react and framer-motion
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
            className={\`relative flex items-center justify-center \${className}\`}
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

// NOTE TO GENERATOR: Replace the injected paths with the actual paths!
`;

// Extract groups from svgContent
const extractGroupContent = (id) => {
    let regex;
    if (id === 'ER_dot') {
        regex = /<motion.polygon id="ER_dot".*?\/>/s;
        const match = svgContent.match(regex);
        return match ? match[0] : '';
    }
    if (id === 'ER') {
        regex = /<motion.polyline id="ER".*?\/>/s;
        const match = svgContent.match(regex);
        return match ? match[0] : '';
    }

    regex = new RegExp(\`<g id="\${id}".*?>(.*?)<\\/g>\`, 's');
    const match = svgContent.match(regex);
    return match ? match[1] : '';
}

let finalCode = componentCode.replace('<!-- injected path 1 -->', extractGroupContent('lines_3'));
finalCode = finalCode.replace('<!-- injected path 2 -->', extractGroupContent('lines_2'));
finalCode = finalCode.replace('<!-- injected path 3 -->', extractGroupContent('lines_1'));
finalCode = finalCode.replace('<!-- injected ER_dot -->', extractGroupContent('ER_dot'));
finalCode = finalCode.replace('<!-- injected ER -->', extractGroupContent('ER'));

fs.writeFileSync(outPath, finalCode, 'utf8');
console.log('AdvancedSvgLogo.tsx generated successfully.');

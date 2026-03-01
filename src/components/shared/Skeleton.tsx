'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`relative overflow-hidden bg-gray-200 rounded-md ${className}`}>
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
        </div>
    );
}

export function ProductSkeleton() {
    return (
        <div className="rounded-3xl bg-white border border-border-soft overflow-hidden animate-pulse">
            <div className="relative aspect-square bg-gray-100" />
            <div className="p-8">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <div className="space-y-3 mb-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-12 w-full rounded-full" />
            </div>
        </div>
    );
}

export function BlogSkeleton() {
    return (
        <div className="group rounded-3xl bg-white border border-border-soft overflow-hidden transition-all duration-500 animate-pulse">
            <div className="relative h-48 bg-gray-100" />
            <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-7 w-full mb-3" />
                <Skeleton className="h-7 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </div>
    );
}

export function DashboardStatSkeleton() {
    return (
        <div className="p-5 rounded-2xl bg-white border border-border-soft animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100" />
                <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-3 w-1/3" />
        </div>
    );
}

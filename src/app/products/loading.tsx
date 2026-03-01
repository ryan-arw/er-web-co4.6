import { ProductSkeleton, Skeleton } from '@/components/shared/Skeleton';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

export default function ProductsLoading() {
    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20 min-h-screen animate-pulse">
                {/* Hero Skeleton */}
                <div className="max-w-4xl mx-auto px-6 md:px-8 text-center mb-20 space-y-6">
                    <div className="h-6 w-24 bg-gray-100 rounded-full mx-auto" />
                    <div className="h-16 w-3/4 bg-gray-100 rounded-md mx-auto" />
                    <Skeleton className="h-10 w-1/2 mx-auto" />
                    <Skeleton className="h-4 w-1/3 mx-auto" />
                </div>

                {/* Box Content Skeleton */}
                <div className="max-w-5xl mx-auto px-6 md:px-8 mb-20">
                    <div className="h-8 w-1/4 bg-gray-100 rounded-md mx-auto mb-10" />
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
                        ))}
                    </div>
                </div>

                {/* Products Grid Skeleton */}
                <div className="max-w-7xl mx-auto px-6 md:px-8 mb-20">
                    <div className="h-10 w-1/3 bg-gray-100 rounded-md mx-auto mb-12" />
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[1, 2].map((i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                </div>

                {/* Subscription Card Skeleton */}
                <div className="max-w-4xl mx-auto px-6 md:px-8">
                    <div className="h-64 rounded-3xl bg-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-200 rounded-full -translate-y-1/2 translate-x-1/2" />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

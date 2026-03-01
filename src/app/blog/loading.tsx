import { BlogSkeleton } from '@/components/shared/Skeleton';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

export default function BlogLoading() {
    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20 min-h-screen animate-pulse">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <div className="h-4 w-16 bg-gray-100 rounded-full mx-auto" />
                        <div className="h-10 w-3/4 bg-gray-100 rounded-md mx-auto" />
                        <div className="h-5 w-1/2 bg-gray-100 rounded-md mx-auto" />
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="px-6 py-2 h-10 w-24 bg-gray-100 rounded-full" />
                        ))}
                    </div>

                    {/* Posts Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <BlogSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

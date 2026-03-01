import { DashboardStatSkeleton, Skeleton } from '@/components/shared/Skeleton';

export default function DashboardLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Welcome */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gray-100 h-8 w-64 rounded-md mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="bg-gray-100 h-10 w-32 rounded-full" />
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <DashboardStatSkeleton key={i} />
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-bold bg-gray-100 h-7 w-24 rounded-md mb-4" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-5 rounded-2xl bg-white border border-border-soft">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 mb-4" />
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Journey CTA */}
            <div className="p-8 rounded-3xl bg-gray-100 h-48 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gray-200 rounded-full -translate-y-1/4 translate-x-1/4" />
                <div className="relative space-y-4">
                    <Skeleton className="h-6 w-1/3 bg-gray-200" />
                    <Skeleton className="h-4 w-1/2 bg-gray-200" />
                    <Skeleton className="h-10 w-32 rounded-full bg-gray-200" />
                </div>
            </div>
        </div>
    );
}

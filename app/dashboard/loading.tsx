import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#09090b] p-8 space-y-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        
        <div className="space-y-6">
           <Skeleton className="h-10 w-48 mb-6" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

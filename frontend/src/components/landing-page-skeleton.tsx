import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LandingPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-10 w-full sm:w-40" />
            <Skeleton className="h-10 w-full sm:w-40" />
          </div>
        </div>

        {/* Features Section (static, always rendered) */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-8 mb-2 rounded-full" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* CTA Section Skeleton */}
        <div className="text-center bg-card border border-border rounded-lg p-8">
          <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-4 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-10 w-48 mx-auto" />
        </div>
      </main>
    </div>
  );
}

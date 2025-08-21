export default function ToursLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-pulse">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="border rounded-2xl shadow-lg p-6 bg-white"
        >
          {/* Image skeleton */}
          <div className="w-full h-56 bg-gray-200 rounded-xl mb-4" />
          
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          
          {/* Description skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
          
          {/* Details skeleton */}
          <div className="flex gap-4 mb-4">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
          
          {/* Price and button skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-24" />
            <div className="h-10 bg-gray-200 rounded w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

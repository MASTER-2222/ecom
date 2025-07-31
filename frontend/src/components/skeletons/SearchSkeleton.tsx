import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SkeletonBox, SkeletonLine, SkeletonCircle } from './BaseSkeleton';
import { cn } from '@/lib/utils';

interface SearchSkeletonProps {
  showFilters?: boolean;
  resultsCount?: number;
  variant?: 'grid' | 'list';
  className?: string;
}

const SearchSkeleton: React.FC<SearchSkeletonProps> = ({
  showFilters = true,
  resultsCount = 12,
  variant = 'grid',
  className
}) => {
  return (
    <div className={cn('container mx-auto px-4 py-6', className)}>
      {/* Search Header */}
      <div className="mb-6">
        {/* Search Query Display */}
        <div className="mb-4">
          <SkeletonLine height="2rem" width="20rem" />
          <SkeletonLine height="1rem" width="15rem" className="mt-2" />
        </div>
        
        {/* Sort and View Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <SkeletonLine height="1rem" width="8rem" />
            <SkeletonBox height="2.5rem" width="10rem" />
          </div>
          
          <div className="flex items-center gap-2">
            <SkeletonLine height="1rem" width="6rem" />
            <div className="flex gap-2">
              <SkeletonBox height="2.5rem" width="2.5rem" />
              <SkeletonBox height="2.5rem" width="2.5rem" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <SkeletonLine height="1.25rem" width="4rem" />
                <SkeletonLine height="1rem" width="3rem" />
              </div>

              {/* Category Filter */}
              <Card>
                <CardContent className="p-4">
                  <SkeletonLine height="1.125rem" width="6rem" className="mb-3" />
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <SkeletonCircle size="1rem" />
                        <SkeletonLine height="1rem" width={`${Math.random() * 40 + 50}%`} />
                        <SkeletonLine height="0.875rem" width="2rem" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Price Filter */}
              <Card>
                <CardContent className="p-4">
                  <SkeletonLine height="1.125rem" width="4rem" className="mb-3" />
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <SkeletonBox height="2.5rem" className="flex-1" />
                      <SkeletonBox height="2.5rem" className="flex-1" />
                    </div>
                    <SkeletonBox height="1rem" />
                  </div>
                </CardContent>
              </Card>

              {/* Brand Filter */}
              <Card>
                <CardContent className="p-4">
                  <SkeletonLine height="1.125rem" width="5rem" className="mb-3" />
                  <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <SkeletonCircle size="1rem" />
                        <SkeletonLine height="1rem" width={`${Math.random() * 40 + 40}%`} />
                      </div>
                    ))}
                  </div>
                  <SkeletonLine height="1rem" width="6rem" className="mt-3" />
                </CardContent>
              </Card>

              {/* Rating Filter */}
              <Card>
                <CardContent className="p-4">
                  <SkeletonLine height="1.125rem" width="5rem" className="mb-3" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <SkeletonCircle size="1rem" />
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, j) => (
                            <SkeletonCircle key={j} size="0.875rem" />
                          ))}
                        </div>
                        <SkeletonLine height="1rem" width="3rem" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="flex-1">
          {/* Active Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <SkeletonBox key={i} height="2rem" width={`${Math.random() * 40 + 60}px`} className="rounded-full" />
              ))}
            </div>
          </div>

          {/* Results */}
          {variant === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(resultsCount)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-4">
                    <SkeletonBox aspect="square" className="mb-3" />
                    <SkeletonLine height="1rem" className="mb-2" />
                    <SkeletonLine height="1rem" width="75%" className="mb-2" />
                    <SkeletonLine height="0.875rem" width="50%" className="mb-3" />
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, j) => (
                          <SkeletonCircle key={j} size="0.875rem" />
                        ))}
                      </div>
                      <SkeletonLine height="0.875rem" width="2rem" />
                    </div>
                    <div className="flex items-center justify-between">
                      <SkeletonLine height="1.25rem" width="4rem" />
                      <SkeletonCircle size="2rem" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[...Array(resultsCount)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="flex gap-4 p-4">
                    <SkeletonBox width="150px" height="150px" className="flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <SkeletonLine height="1.25rem" width="75%" />
                      <SkeletonLine height="1rem" width="50%" />
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, j) => (
                            <SkeletonCircle key={j} size="1rem" />
                          ))}
                        </div>
                        <SkeletonLine height="1rem" width="3rem" />
                      </div>
                      <div className="space-y-2">
                        <SkeletonLine height="1rem" />
                        <SkeletonLine height="1rem" width="80%" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <SkeletonLine height="1.5rem" width="4rem" />
                          <SkeletonLine height="1rem" width="3rem" />
                        </div>
                        <div className="flex gap-2">
                          <SkeletonCircle size="2.5rem" />
                          <SkeletonCircle size="2.5rem" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <SkeletonBox height="2.5rem" width="2.5rem" />
              {[...Array(5)].map((_, i) => (
                <SkeletonBox key={i} height="2.5rem" width="2.5rem" />
              ))}
              <SkeletonBox height="2.5rem" width="2.5rem" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Search suggestions skeleton
export const SearchSuggestionsSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
    <CardContent className="p-2">
      <div className="space-y-1">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded">
            <SkeletonCircle size="1.25rem" />
            <SkeletonLine height="1rem" width={`${Math.random() * 50 + 30}%`} />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default SearchSkeleton;
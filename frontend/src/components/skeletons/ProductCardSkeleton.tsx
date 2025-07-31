import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SkeletonBox, SkeletonLine, SkeletonCircle } from './BaseSkeleton';
import { cn } from '@/lib/utils';

interface ProductCardSkeletonProps {
  variant?: 'grid' | 'list' | 'compact';
  showActions?: boolean;
  className?: string;
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  variant = 'grid',
  showActions = true,
  className
}) => {
  if (variant === 'list') {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <div className="flex gap-4 p-4">
          {/* Product Image */}
          <SkeletonBox width="120px" height="120px" className="flex-shrink-0" />
          
          {/* Product Details */}
          <div className="flex-1 space-y-3">
            {/* Title */}
            <SkeletonLine height="1.25rem" width="75%" />
            
            {/* Brand */}
            <SkeletonLine height="0.875rem" width="40%" />
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <SkeletonCircle key={i} size="1rem" />
                ))}
              </div>
              <SkeletonLine height="0.875rem" width="3rem" />
            </div>
            
            {/* Price */}
            <div className="flex items-center gap-2">
              <SkeletonLine height="1.5rem" width="4rem" />
              <SkeletonLine height="1rem" width="3rem" />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <SkeletonLine height="0.875rem" width="100%" />
              <SkeletonLine height="0.875rem" width="80%" />
            </div>
          </div>
          
          {/* Actions */}
          {showActions && (
            <div className="flex flex-col gap-2 justify-center">
              <SkeletonBox width="2.5rem" height="2.5rem" />
              <SkeletonBox width="2.5rem" height="2.5rem" />
              <SkeletonBox width="2.5rem" height="2.5rem" />
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-3">
          {/* Product Image */}
          <SkeletonBox aspect="square" className="mb-3" />
          
          {/* Title */}
          <SkeletonLine height="1rem" className="mb-2" />
          <SkeletonLine height="1rem" width="60%" className="mb-2" />
          
          {/* Price */}
          <SkeletonLine height="1.25rem" width="40%" />
        </CardContent>
      </Card>
    );
  }

  // Default grid variant
  return (
    <Card className={cn('overflow-hidden group', className)}>
      <CardContent className="p-4">
        {/* Product Image */}
        <div className="relative mb-4">
          <SkeletonBox aspect="square" />
          
          {/* Badge overlay */}
          <div className="absolute top-2 left-2">
            <SkeletonBox width="3rem" height="1.5rem" className="rounded-full" />
          </div>
          
          {/* Action buttons overlay */}
          {showActions && (
            <div className="absolute top-2 right-2 space-y-2">
              <SkeletonCircle size="2rem" />
              <SkeletonCircle size="2rem" />
            </div>
          )}
        </div>
        
        {/* Brand */}
        <SkeletonLine height="0.875rem" width="50%" className="mb-2" />
        
        {/* Title */}
        <SkeletonLine height="1.125rem" className="mb-1" />
        <SkeletonLine height="1.125rem" width="75%" className="mb-3" />
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <SkeletonCircle key={i} size="1rem" />
            ))}
          </div>
          <SkeletonLine height="0.875rem" width="2.5rem" />
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <SkeletonLine height="1.5rem" width="4rem" />
          <SkeletonLine height="1rem" width="3rem" />
          <SkeletonBox width="2.5rem" height="1.25rem" className="rounded-full" />
        </div>
        
        {/* Add to Cart Button */}
        <SkeletonBox height="2.5rem" className="rounded-lg" />
      </CardContent>
    </Card>
  );
};

// Multi-card skeleton for grids
export const ProductGridSkeleton: React.FC<{
  count?: number;
  variant?: 'grid' | 'list' | 'compact';
  className?: string;
}> = ({ count = 8, variant = 'grid', className }) => {
  const gridClass = variant === 'list' 
    ? 'space-y-4' 
    : variant === 'compact'
    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';

  return (
    <div className={cn(gridClass, className)}>
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SkeletonBox, SkeletonLine, SkeletonCircle } from './BaseSkeleton';
import { cn } from '@/lib/utils';

interface CartSkeletonProps {
  items?: number;
  showSummary?: boolean;
  variant?: 'page' | 'drawer' | 'mini';
  className?: string;
}

const CartSkeleton: React.FC<CartSkeletonProps> = ({
  items = 3,
  showSummary = true,
  variant = 'page',
  className
}) => {
  if (variant === 'mini') {
    return (
      <div className={cn('space-y-3', className)}>
        {[...Array(items)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <SkeletonBox width="3rem" height="3rem" />
            <div className="flex-1 space-y-1">
              <SkeletonLine height="0.875rem" width="80%" />
              <SkeletonLine height="0.75rem" width="40%" />
            </div>
            <SkeletonLine height="1rem" width="3rem" />
          </div>
        ))}
        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <SkeletonLine height="1rem" width="3rem" />
            <SkeletonLine height="1.25rem" width="4rem" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'drawer') {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <SkeletonLine height="1.5rem" width="8rem" />
          <SkeletonCircle size="2rem" />
        </div>

        {/* Items */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {[...Array(items)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <SkeletonBox width="5rem" height="5rem" />
              <div className="flex-1 space-y-2">
                <SkeletonLine height="1rem" />
                <SkeletonLine height="0.875rem" width="60%" />
                <div className="flex items-center justify-between">
                  <SkeletonBox height="2rem" width="5rem" />
                  <SkeletonLine height="1rem" width="3rem" />
                </div>
              </div>
              <SkeletonCircle size="1.5rem" />
            </div>
          ))}
        </div>

        {/* Summary */}
        {showSummary && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between">
              <SkeletonLine height="1rem" width="4rem" />
              <SkeletonLine height="1rem" width="3rem" />
            </div>
            <div className="flex justify-between">
              <SkeletonLine height="1rem" width="5rem" />
              <SkeletonLine height="1rem" width="4rem" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <SkeletonLine height="1.25rem" width="3rem" />
              <SkeletonLine height="1.25rem" width="5rem" />
            </div>
            <SkeletonBox height="3rem" className="w-full" />
          </div>
        )}
      </div>
    );
  }

  // Page variant
  return (
    <div className={cn('container mx-auto px-4 py-8', className)}>
      {/* Header */}
      <div className="mb-8">
        <SkeletonLine height="2.5rem" width="12rem" className="mb-2" />
        <SkeletonLine height="1rem" width="20rem" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Header */}
          <div className="flex items-center justify-between">
            <SkeletonLine height="1.25rem" width="8rem" />
            <SkeletonLine height="1rem" width="6rem" />
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {[...Array(items)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <SkeletonBox width="120px" height="120px" />
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between">
                        <div className="space-y-2">
                          <SkeletonLine height="1.25rem" width="80%" />
                          <SkeletonLine height="1rem" width="50%" />
                          <SkeletonLine height="0.875rem" width="40%" />
                        </div>
                        <SkeletonCircle size="2rem" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, j) => (
                            <SkeletonCircle key={j} size="1rem" />
                          ))}
                        </div>
                        <SkeletonLine height="0.875rem" width="4rem" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <SkeletonBox height="2.5rem" width="8rem" />
                          <SkeletonLine height="1rem" width="6rem" />
                        </div>
                        <SkeletonLine height="1.5rem" width="5rem" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="pt-6">
            <SkeletonBox height="3rem" width="12rem" />
          </div>
        </div>

        {/* Order Summary */}
        {showSummary && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <SkeletonLine height="1.5rem" width="8rem" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <SkeletonLine height="1rem" width="6rem" />
                    <SkeletonLine height="1rem" width="4rem" />
                  </div>
                  <div className="flex justify-between">
                    <SkeletonLine height="1rem" width="5rem" />
                    <SkeletonLine height="1rem" width="3rem" />
                  </div>
                  <div className="flex justify-between">
                    <SkeletonLine height="1rem" width="4rem" />
                    <SkeletonLine height="1rem" width="4rem" />
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <SkeletonLine height="1.25rem" width="3rem" />
                    <SkeletonLine height="1.25rem" width="5rem" />
                  </div>
                </div>
                
                <SkeletonBox height="3rem" className="w-full" />
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <SkeletonLine height="1rem" width="6rem" />
                <div className="flex gap-2">
                  <SkeletonBox height="2.5rem" className="flex-1" />
                  <SkeletonBox height="2.5rem" width="4rem" />
                </div>
              </CardContent>
            </Card>

            {/* Payment Security */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <SkeletonLine height="1rem" width="8rem" />
                <div className="flex gap-3">
                  <SkeletonBox width="3rem" height="2rem" />
                  <SkeletonBox width="3rem" height="2rem" />
                  <SkeletonBox width="3rem" height="2rem" />
                  <SkeletonBox width="3rem" height="2rem" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSkeleton;
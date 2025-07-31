import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SkeletonBox, SkeletonLine, SkeletonCircle } from './BaseSkeleton';
import { cn } from '@/lib/utils';

interface ProductDetailSkeletonProps {
  className?: string;
}

const ProductDetailSkeleton: React.FC<ProductDetailSkeletonProps> = ({ className }) => {
  return (
    <div className={cn('container mx-auto px-4 py-8', className)}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <SkeletonLine height="1rem" width="3rem" />
        <SkeletonLine height="1rem" width="1rem" />
        <SkeletonLine height="1rem" width="4rem" />
        <SkeletonLine height="1rem" width="1rem" />
        <SkeletonLine height="1rem" width="6rem" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <SkeletonBox aspect="square" className="mb-4" />
          
          {/* Thumbnail Images */}
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => (
              <SkeletonBox key={i} width="80px" height="80px" className="flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Brand */}
          <SkeletonLine height="1rem" width="30%" />
          
          {/* Title */}
          <div className="space-y-2">
            <SkeletonLine height="2rem" />
            <SkeletonLine height="2rem" width="75%" />
          </div>
          
          {/* Rating and Reviews */}
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <SkeletonCircle key={i} size="1.25rem" />
              ))}
            </div>
            <SkeletonLine height="1rem" width="8rem" />
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-4">
            <SkeletonLine height="2.5rem" width="6rem" />
            <SkeletonLine height="1.5rem" width="4rem" />
            <SkeletonBox width="4rem" height="1.5rem" className="rounded-full" />
          </div>
          
          {/* Short Description */}
          <div className="space-y-2">
            <SkeletonLine height="1rem" />
            <SkeletonLine height="1rem" />
            <SkeletonLine height="1rem" width="80%" />
          </div>
          
          {/* Variants/Options */}
          <div className="space-y-4">
            {/* Size/Color Options */}
            <div>
              <SkeletonLine height="1rem" width="4rem" className="mb-3" />
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <SkeletonBox key={i} width="3rem" height="3rem" />
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div>
              <SkeletonLine height="1rem" width="5rem" className="mb-3" />
              <SkeletonBox width="8rem" height="3rem" />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <SkeletonBox height="3rem" className="flex-1" />
            <SkeletonBox height="3rem" width="3rem" />
            <SkeletonBox height="3rem" width="3rem" />
          </div>
          
          {/* Additional Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <SkeletonLine height="1rem" width="6rem" />
              <SkeletonLine height="1rem" width="8rem" />
            </div>
            <div className="flex justify-between items-center">
              <SkeletonLine height="1rem" width="5rem" />
              <SkeletonLine height="1rem" width="10rem" />
            </div>
            <div className="flex justify-between items-center">
              <SkeletonLine height="1rem" width="7rem" />
              <SkeletonLine height="1rem" width="6rem" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16">
        {/* Tab Headers */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonLine key={i} height="1.25rem" width="6rem" />
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <SkeletonLine height="1.5rem" width="50%" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <SkeletonLine key={i} height="1rem" width={i === 5 ? '60%' : '100%'} />
              ))}
            </div>
            
            {/* Features List */}
            <div className="space-y-3 mt-6">
              <SkeletonLine height="1.25rem" width="40%" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <SkeletonCircle size="0.5rem" />
                  <SkeletonLine height="1rem" width="80%" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                <SkeletonLine height="1.25rem" width="60%" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <SkeletonLine height="1rem" width="50%" />
                      <SkeletonLine height="1rem" width="30%" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 space-y-4">
                <SkeletonLine height="1.25rem" width="70%" />
                <SkeletonBox height="8rem" />
                <SkeletonLine height="1rem" width="80%" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <SkeletonLine height="2rem" width="12rem" />
          <SkeletonBox height="2.5rem" width="8rem" />
        </div>

        {/* Review Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <SkeletonLine height="3rem" width="4rem" />
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <SkeletonCircle key={i} size="1.5rem" />
                      ))}
                    </div>
                    <SkeletonLine height="1rem" width="8rem" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <SkeletonLine height="1rem" width="1rem" />
                    <SkeletonBox height="0.5rem" width="8rem" />
                    <SkeletonLine height="1rem" width="2rem" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Reviews */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <SkeletonCircle size="3rem" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <SkeletonLine height="1.25rem" width="8rem" />
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, j) => (
                          <SkeletonCircle key={j} size="1rem" />
                        ))}
                      </div>
                      <SkeletonLine height="1rem" width="6rem" />
                    </div>
                    <div className="space-y-2">
                      <SkeletonLine height="1rem" />
                      <SkeletonLine height="1rem" />
                      <SkeletonLine height="1rem" width="75%" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <SkeletonLine height="2rem" width="12rem" className="mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <SkeletonBox aspect="square" />
                <SkeletonLine height="1rem" />
                <SkeletonLine height="1rem" width="60%" />
                <SkeletonLine height="1.25rem" width="40%" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
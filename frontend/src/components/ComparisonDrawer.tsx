import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, Eye, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useComparison } from '@/hooks/useComparison';
import { cn } from '@/lib/utils';

interface ComparisonDrawerProps {
  className?: string;
}

const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({ className }) => {
  const { 
    comparedProducts, 
    removeFromComparison, 
    clearComparison, 
    comparisonCount 
  } = useComparison();
  
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (comparisonCount === 0) {
    return null;
  }

  return (
    <div className={cn('fixed bottom-4 right-4 z-50', className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg relative group"
          >
            <Scale className="w-5 h-5 mr-2" />
            Compare
            <Badge className="ml-2 bg-white text-blue-600 font-bold">
              {comparisonCount}
            </Badge>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Product Comparison
            </SheetTitle>
            <SheetDescription>
              Compare up to 4 products side by side
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {/* Products List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {comparedProducts.map((product) => (
                <Card key={product.id} className="relative">
                  <CardContent className="p-3">
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {product.thumbnail || product.images?.[0] ? (
                          <img
                            src={product.thumbnail || product.images[0]}
                            alt={product.name || product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {product.name || product.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {product.brand}
                        </p>
                        <p className="font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t">
              <Link to="/comparison" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Comparison
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Button
                variant="outline"
                onClick={clearComparison}
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>

            {/* Add More Info */}
            <div className="text-center text-sm text-gray-500 pt-2">
              {comparisonCount < 4 ? (
                <p>Add {4 - comparisonCount} more product{4 - comparisonCount !== 1 ? 's' : ''} to compare</p>
              ) : (
                <p>Maximum comparison limit reached</p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ComparisonDrawer;
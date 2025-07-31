import React from 'react';
import { Scale, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useComparison } from '@/hooks/useComparison';
import { Product } from '@/types';

interface ComparisonButtonProps {
  product: Product;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  showText?: boolean;
  className?: string;
}

const ComparisonButton: React.FC<ComparisonButtonProps> = ({
  product,
  size = 'default',
  variant = 'outline',
  showText = false,
  className
}) => {
  const { isInComparison, addToComparison, removeFromComparison, canAddMore } = useComparison();
  
  const inComparison = isInComparison(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inComparison) {
      removeFromComparison(product.id);
    } else {
      if (canAddMore) {
        addToComparison(product);
      }
    }
  };

  const buttonText = inComparison ? (showText ? 'Remove from Compare' : '') : (showText ? 'Compare' : '');
  const icon = inComparison ? <X className="w-4 h-4" /> : <Scale className="w-4 h-4" />;
  const buttonVariant = inComparison ? 'default' : variant;

  return (
    <Button
      onClick={handleClick}
      size={size}
      variant={buttonVariant}
      disabled={!inComparison && !canAddMore}
      className={cn(
        'transition-colors',
        inComparison && 'bg-blue-600 hover:bg-blue-700 text-white',
        !canAddMore && !inComparison && 'opacity-50 cursor-not-allowed',
        className
      )}
      title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
    >
      {icon}
      {showText && buttonText && <span className="ml-2">{buttonText}</span>}
    </Button>
  );
};

export default ComparisonButton;
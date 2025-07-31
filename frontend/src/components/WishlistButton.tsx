import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Product } from '@/types';

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline' | 'ghost';
  showText?: boolean;
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  size = 'md',
  variant = 'ghost',
  showText = false,
  className
}) => {
  const { isInWishlist, toggleWishlist, loading } = useWishlist();
  const { isAuthenticated } = useAuth();
  
  const inWishlist = isInWishlist(product.id);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Could open login modal or redirect to login
      return;
    }
    
    await toggleWishlist(product);
  };

  const sizeClasses = {
    sm: 'h-8 w-8 p-0',
    md: 'h-9 w-9 p-0',
    lg: 'h-10 w-10 p-0'
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  if (showText) {
    return (
      <Button
        variant={variant === 'filled' ? 'default' : variant}
        size={size}
        onClick={handleClick}
        disabled={loading}
        className={cn(
          'flex items-center gap-2',
          inWishlist && variant === 'filled' && 'bg-red-500 hover:bg-red-600',
          inWishlist && variant === 'outline' && 'border-red-500 text-red-500 hover:bg-red-50',
          inWishlist && variant === 'ghost' && 'text-red-500 hover:bg-red-50',
          className
        )}
      >
        <Heart 
          className={cn(
            iconSizes[size],
            inWishlist && 'fill-current'
          )} 
        />
        {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </Button>
    );
  }

  return (
    <Button
      variant={variant === 'filled' ? 'default' : variant}
      size={size}
      onClick={handleClick}
      disabled={loading}
      className={cn(
        sizeClasses[size],
        'rounded-full',
        inWishlist && variant === 'filled' && 'bg-red-500 hover:bg-red-600',
        inWishlist && variant === 'outline' && 'border-red-500 text-red-500 hover:bg-red-50',
        inWishlist && variant === 'ghost' && 'text-red-500 hover:bg-red-50 hover:text-red-600',
        !inWishlist && variant === 'ghost' && 'text-gray-400 hover:text-red-500',
        className
      )}
      title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          inWishlist && 'fill-current'
        )} 
      />
    </Button>
  );
};

export default WishlistButton;
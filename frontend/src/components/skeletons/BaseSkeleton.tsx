import React from 'react';
import { cn } from '@/lib/utils';

interface BaseSkeletonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'pulse' | 'wave' | 'shimmer';
  speed?: 'slow' | 'normal' | 'fast';
}

const BaseSkeleton: React.FC<BaseSkeletonProps> = ({ 
  className, 
  children, 
  variant = 'pulse',
  speed = 'normal'
}) => {
  const getAnimationClass = () => {
    const speedClass = {
      slow: 'animate-pulse',
      normal: 'animate-pulse',
      fast: 'animate-pulse'
    }[speed];

    switch (variant) {
      case 'wave':
        return `${speedClass} animate-bounce`;
      case 'shimmer':
        return 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite]';
      default:
        return speedClass;
    }
  };

  return (
    <div 
      className={cn(
        'bg-gray-200 rounded', 
        getAnimationClass(),
        className
      )}
      role="status" 
      aria-label="Loading..."
    >
      {children}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Skeleton line component for text
export const SkeletonLine: React.FC<{
  width?: string | number;
  height?: string | number;
  className?: string;
}> = ({ width = '100%', height = '1rem', className }) => (
  <BaseSkeleton 
    className={cn('block', className)} 
    style={{ width, height }} 
  />
);

// Skeleton circle component for avatars/icons
export const SkeletonCircle: React.FC<{
  size?: string | number;
  className?: string;
}> = ({ size = '2.5rem', className }) => (
  <BaseSkeleton 
    className={cn('rounded-full', className)} 
    style={{ width: size, height: size }} 
  />
);

// Skeleton box component for images/cards
export const SkeletonBox: React.FC<{
  width?: string | number;
  height?: string | number;
  className?: string;
  aspect?: 'square' | 'video' | 'photo';
}> = ({ width = '100%', height, className, aspect }) => {
  const aspectClass = aspect ? {
    square: 'aspect-square',
    video: 'aspect-video',
    photo: 'aspect-[4/3]'
  }[aspect] : '';

  return (
    <BaseSkeleton 
      className={cn(aspectClass, className)} 
      style={{ width, height: aspectClass ? undefined : height }} 
    />
  );
};

export default BaseSkeleton;
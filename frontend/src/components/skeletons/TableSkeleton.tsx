import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SkeletonBox, SkeletonLine, SkeletonCircle } from './BaseSkeleton';
import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  showActions?: boolean;
  showCheckboxes?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
  variant?: 'simple' | 'card' | 'admin';
  className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  showActions = true,
  showCheckboxes = false,
  showFilters = false,
  showPagination = true,
  variant = 'simple',
  className
}) => {
  const actualColumns = columns + (showCheckboxes ? 1 : 0) + (showActions ? 1 : 0);

  const TableContent = () => (
    <Table>
      {showHeader && (
        <TableHeader>
          <TableRow>
            {showCheckboxes && (
              <TableHead className="w-12">
                <SkeletonCircle size="1rem" />
              </TableHead>
            )}
            {[...Array(columns)].map((_, i) => (
              <TableHead key={i}>
                <SkeletonLine height="1rem" width={`${Math.random() * 40 + 40}%`} />
              </TableHead>
            ))}
            {showActions && (
              <TableHead className="w-24">
                <SkeletonLine height="1rem" width="4rem" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {[...Array(rows)].map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {showCheckboxes && (
              <TableCell>
                <SkeletonCircle size="1rem" />
              </TableCell>
            )}
            {[...Array(columns)].map((_, colIndex) => (
              <TableCell key={colIndex}>
                {colIndex === 0 ? (
                  // First column often has more prominent content
                  <div className="space-y-1">
                    <SkeletonLine height="1rem" width="80%" />
                    <SkeletonLine height="0.75rem" width="60%" />
                  </div>
                ) : colIndex === 1 && Math.random() > 0.5 ? (
                  // Sometimes show badge-like content
                  <SkeletonBox height="1.5rem" width="4rem" className="rounded-full" />
                ) : (
                  <SkeletonLine height="1rem" width={`${Math.random() * 60 + 30}%`} />
                )}
              </TableCell>
            ))}
            {showActions && (
              <TableCell>
                <div className="flex gap-2">
                  <SkeletonCircle size="2rem" />
                  <SkeletonCircle size="2rem" />
                  <SkeletonCircle size="2rem" />
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <SkeletonLine height="1.5rem" width="12rem" />
            <div className="flex gap-2">
              <SkeletonBox height="2.5rem" width="6rem" />
              <SkeletonBox height="2.5rem" width="4rem" />
            </div>
          </div>
          {showFilters && (
            <div className="flex gap-4 mt-4">
              <SkeletonBox height="2.5rem" width="12rem" />
              <SkeletonBox height="2.5rem" width="8rem" />
              <SkeletonBox height="2.5rem" width="6rem" />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <TableContent />
          {showPagination && (
            <div className="flex justify-between items-center p-4 border-t">
              <SkeletonLine height="1rem" width="8rem" />
              <div className="flex gap-2">
                <SkeletonBox height="2rem" width="2rem" />
                <SkeletonBox height="2rem" width="2rem" />
                <SkeletonBox height="2rem" width="2rem" />
                <SkeletonBox height="2rem" width="2rem" />
                <SkeletonBox height="2rem" width="2rem" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'admin') {
    return (
      <div className={className}>
        {/* Admin Table Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <SkeletonLine height="2rem" width="16rem" />
              <SkeletonLine height="1rem" width="24rem" />
            </div>
            <div className="flex gap-2">
              <SkeletonBox height="2.5rem" width="8rem" />
              <SkeletonBox height="2.5rem" width="6rem" />
            </div>
          </div>
          
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SkeletonBox height="2.5rem" />
            </div>
            <div className="flex gap-2">
              <SkeletonBox height="2.5rem" width="8rem" />
              <SkeletonBox height="2.5rem" width="6rem" />
              <SkeletonBox height="2.5rem" width="4rem" />
            </div>
          </div>
          
          {/* Bulk Actions Bar */}
          {showCheckboxes && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <SkeletonLine height="1rem" width="8rem" />
                <div className="flex gap-2">
                  <SkeletonBox height="2rem" width="6rem" />
                  <SkeletonBox height="2rem" width="5rem" />
                  <SkeletonBox height="2rem" width="4rem" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <TableContent />
          </CardContent>
        </Card>

        {/* Pagination */}
        {showPagination && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <SkeletonLine height="1rem" width="12rem" />
            <div className="flex items-center gap-2">
              <SkeletonLine height="1rem" width="6rem" />
              <div className="flex gap-1">
                <SkeletonBox height="2.5rem" width="2.5rem" />
                <SkeletonBox height="2.5rem" width="2.5rem" />
                <SkeletonBox height="2.5rem" width="2.5rem" />
                <SkeletonBox height="2.5rem" width="2.5rem" />
                <SkeletonBox height="2.5rem" width="2.5rem" />
              </div>
              <SkeletonBox height="2.5rem" width="2.5rem" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Simple variant
  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      <TableContent />
      {showPagination && (
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <SkeletonLine height="1rem" width="8rem" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <SkeletonBox key={i} height="2rem" width="2rem" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Specialized skeleton for different table types
export const OrderTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <TableSkeleton
    rows={rows}
    columns={6}
    showCheckboxes={true}
    showActions={true}
    showFilters={true}
    variant="admin"
  />
);

export const ProductTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <TableSkeleton
    rows={rows}
    columns={7}
    showCheckboxes={true}
    showActions={true}
    showFilters={true}
    variant="admin"
  />
);

export const UserTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <TableSkeleton
    rows={rows}
    columns={5}
    showCheckboxes={true}
    showActions={true}
    showFilters={true}
    variant="admin"
  />
);

export default TableSkeleton;
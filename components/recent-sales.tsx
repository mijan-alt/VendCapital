import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function RecentSales({ sales, loading }) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {sales?.map((sale) => (
        <div key={sale._id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/default.png" alt="Avatar" />
            <AvatarFallback>{getInitials(sale.customer.name)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {sale.customer.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {sale.customer.email}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {formatCurrency(sale.totalPrice.toFixed(2))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center">
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200"></div>
          <div className="ml-4 flex-1 space-y-1">
            <div className="h-4 animate-pulse rounded bg-gray-200"></div>
            <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}

// Helper function to get initials from name
function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

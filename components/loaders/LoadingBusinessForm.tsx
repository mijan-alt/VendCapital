'use client';
import { Button } from '@/components/ui/button';

const PulsatingField = () => (
  <div className="animate-pulse space-y-2">
    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
    <div className="h-10 rounded bg-gray-200"></div>
  </div>
);

export default function LoadingBusinessForm() {
  return (
    <div className="w-full space-y-4">
      <PulsatingField /> {/* Logo URL */}
      <PulsatingField /> {/* Address */}
      <PulsatingField /> {/* Account Number */}
      <PulsatingField /> {/* Account Name */}
      <PulsatingField /> {/* Bank Name */}
      <div className="flex justify-between">
        <Button disabled className="opacity-50">
          Loading...
        </Button>
      </div>
    </div>
  );
}

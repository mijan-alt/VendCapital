'use client';
import React, { useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';

import { useSidebar } from '@/hooks/useSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSession } from 'next-auth/react';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { data: session } = useSession();
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  return (
    <nav
      className={cn(
        `relative z-10 hidden h-screen flex-none border-r pt-20 md:block`,
        status && 'duration-500',
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
          <div className="mt-12 flex cursor-pointer flex-row gap-4">
            <Avatar>
              <AvatarImage src={session?.user?.image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div
              className={`${
                isMinimized ? 'hidden' : 'flex flex-col justify-center'
              }`}
            >
              <p className="text-sm">{session?.user?.name}</p>
              <p className="text-sm font-bold">{session?.user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

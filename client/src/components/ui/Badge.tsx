import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'green' | 'gray';
  className?: string;
}

export default function Badge({ children, variant = 'orange', className }: BadgeProps) {
  const variants = {
    orange: 'bg-[#F5A623] text-white',
    green: 'bg-green-500 text-white',
    gray: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}

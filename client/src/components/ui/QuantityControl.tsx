import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function QuantityControl({ value, onChange, min = 1, max = 99, className }: QuantityControlProps) {
  return (
    <div className={cn('flex items-center', className)}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded bg-[#F5A623] text-white hover:bg-[#d4890a] transition-colors"
        aria-label="Уменьшить"
      >
        <Minus size={14} />
      </button>
      <span className="w-10 text-center text-sm font-medium">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-8 w-8 items-center justify-center rounded bg-[#F5A623] text-white hover:bg-[#d4890a] transition-colors"
        aria-label="Увеличить"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

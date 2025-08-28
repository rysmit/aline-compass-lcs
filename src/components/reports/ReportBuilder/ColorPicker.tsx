import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#ec4899', // pink
  '#6366f1', // indigo
];

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-8 w-full justify-start gap-2"
          >
            <div
              className="h-4 w-4 rounded border"
              style={{ backgroundColor: value }}
            />
            <span className="text-xs font-mono">{value}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "h-8 w-8 rounded border-2 border-transparent hover:border-foreground transition-colors",
                    value === color && "border-foreground"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onChange(color);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Custom Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="h-8 w-16 p-1"
                />
                <Input
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="#000000"
                  className="h-8 flex-1 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { DateRange } from 'react-day-picker';

// Helper date functions (to avoid external dependencies like date-fns for this specific generation)
const startOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const endOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

const subDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
};

const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 0);

const subMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - months);
  return newDate;
};

const startOfQuarter = (date: Date): Date => {
  const quarter = Math.floor(date.getMonth() / 3);
  return new Date(date.getFullYear(), quarter * 3, 1);
};

const endOfQuarter = (date: Date): Date => {
  const quarter = Math.floor(date.getMonth() / 3);
  return new Date(date.getFullYear(), quarter * 3 + 3, 0);
};

const subQuarters = (date: Date, quarters: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - quarters * 3);
  return newDate;
}

const startOfYear = (date: Date): Date => new Date(date.getFullYear(), 0, 1);

interface DateRangeValue {
  from: Date;
  to: Date;
}

export interface AdvancedDateRangePickerValue {
  primary: DateRangeValue;
  comparison?: DateRangeValue;
  presetLabel?: string;
  isCompareEnabled?: boolean;
}

interface AdvancedDateRangePickerProps {
  value?: AdvancedDateRangePickerValue;
  onValueChange: (newValue: AdvancedDateRangePickerValue) => void;
  className?: string;
  disabled?: boolean;
  align?: "start" | "center" | "end";
}

interface Preset {
  key: string;
  label: string;
  getRange: () => DateRangeValue;
}

const PRESETS: Preset[] = [
  {
    key: 'today',
    label: 'Today',
    getRange: () => {
      const today = new Date();
      return { from: startOfDay(today), to: endOfDay(today) };
    },
  },
  {
    key: 'yesterday',
    label: 'Yesterday',
    getRange: () => {
      const yesterday = subDays(new Date(), 1);
      return { from: startOfDay(yesterday), to: endOfDay(yesterday) };
    },
  },
  {
    key: 'last7Days',
    label: 'Last 7 days',
    getRange: () => {
      const today = new Date();
      return { from: startOfDay(subDays(today, 6)), to: endOfDay(today) };
    },
  },
  {
    key: 'last30Days',
    label: 'Last 30 days',
    getRange: () => {
      const today = new Date();
      return { from: startOfDay(subDays(today, 29)), to: endOfDay(today) };
    },
  },
  {
    key: 'thisMonth',
    label: 'This month',
    getRange: () => {
      const today = new Date();
      return { from: startOfDay(startOfMonth(today)), to: endOfDay(endOfMonth(today)) };
    },
  },
  {
    key: 'lastMonth',
    label: 'Last month',
    getRange: () => {
      const today = new Date();
      const lastMonthDate = subMonths(today, 1);
      return { from: startOfDay(startOfMonth(lastMonthDate)), to: endOfDay(endOfMonth(lastMonthDate)) };
    },
  },
  {
    key: 'lastQuarter',
    label: 'Last quarter',
    getRange: () => {
      const today = new Date();
      const lastQuarterDate = subQuarters(today,1);
      return { from: startOfDay(startOfQuarter(lastQuarterDate)), to: endOfDay(endOfQuarter(lastQuarterDate)) };
    }
  },
  {
    key: 'yearToDate',
    label: 'Year to date',
    getRange: () => {
      const today = new Date();
      return { from: startOfDay(startOfYear(today)), to: endOfDay(today) };
    },
  },
];

const AdvancedDateRangePicker: React.FC<AdvancedDateRangePickerProps> = ({
  value,
  onValueChange,
  className,
  disabled,
  align = "start",
}) => {
  console.log('AdvancedDateRangePicker loaded');
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Draft states for user interaction within the popover
  const [draftPrimaryRange, setDraftPrimaryRange] = useState<DateRange | undefined>(value?.primary);
  const [draftPresetLabel, setDraftPresetLabel] = useState<string | undefined>(value?.presetLabel);
  const [draftCompareEnabled, setDraftCompareEnabled] = useState<boolean>(value?.isCompareEnabled ?? false);

  useEffect(() => {
    if (value) {
      setDraftPrimaryRange(value.primary);
      setDraftPresetLabel(value.presetLabel);
      setDraftCompareEnabled(value.isCompareEnabled ?? false);
    } else {
      // Set a default if no value is provided, e.g., last 7 days
      const defaultPreset = PRESETS.find(p => p.key === 'last7Days');
      if (defaultPreset) {
        const range = defaultPreset.getRange();
        setDraftPrimaryRange(range);
        setDraftPresetLabel(defaultPreset.label);
      }
    }
  }, [value, popoverOpen]); // Reset drafts when popover opens based on current value

  const handlePresetSelect = (preset: Preset) => {
    const newPrimaryRange = preset.getRange();
    setDraftPrimaryRange(newPrimaryRange);
    setDraftPresetLabel(preset.label);
    // Presets don't auto-apply here; user must click "Apply"
  };

  const handleApply = () => {
    if (draftPrimaryRange?.from && draftPrimaryRange?.to) {
      let comparisonRange: DateRangeValue | undefined = undefined;
      if (draftCompareEnabled) {
        const diff = draftPrimaryRange.to.getTime() - draftPrimaryRange.from.getTime();
        const comparisonEnd = subDays(draftPrimaryRange.from, 1);
        const comparisonStart = new Date(comparisonEnd.getTime() - diff);
        comparisonRange = { from: startOfDay(comparisonStart), to: endOfDay(comparisonEnd) };
      }
      onValueChange({
        primary: { from: draftPrimaryRange.from, to: draftPrimaryRange.to },
        comparison: comparisonRange,
        presetLabel: draftPresetLabel, // This will be null/undefined if custom range is used after preset
        isCompareEnabled: draftCompareEnabled,
      });
      console.log('AdvancedDateRangePicker: Value changed via Apply', {
        primary: draftPrimaryRange,
        comparison: comparisonRange,
        presetLabel: draftPresetLabel,
        isCompareEnabled: draftCompareEnabled,
      });
      setPopoverOpen(false);
    }
  };
  
  const handleCalendarSelect = (range: DateRange | undefined) => {
    setDraftPrimaryRange(range);
    if (range?.from && range?.to) { // If a full custom range is selected, clear preset label
      setDraftPresetLabel(undefined); 
    }
  }

  const displayLabel = useMemo(() => {
    if (value?.presetLabel) {
      return value.presetLabel;
    }
    if (value?.primary?.from && value?.primary?.to) {
      const fromStr = value.primary.from.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const toStr = value.primary.to.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      if (fromStr === toStr.substring(0, fromStr.length) && value.primary.from.getFullYear() === value.primary.to.getFullYear()){ // same day
        return value.primary.from.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return `${fromStr} - ${toStr}`;
    }
    return "Select Date Range";
  }, [value]);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {displayLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col md:flex-row" align={align}>
        <div className="p-4 border-b md:border-b-0 md:border-r">
          <p className="mb-2 text-sm font-medium text-gray-700">Presets</p>
          <div className="space-y-1">
            {PRESETS.map((preset) => (
              <Button
                key={preset.key}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm",
                  draftPresetLabel === preset.label && draftPrimaryRange?.from?.getTime() === preset.getRange().from.getTime() && draftPrimaryRange?.to?.getTime() === preset.getRange().to.getTime() && "bg-accent text-accent-foreground"
                )}
                onClick={() => handlePresetSelect(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="p-4">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={draftPrimaryRange?.from}
            selected={draftPrimaryRange}
            onSelect={handleCalendarSelect}
            numberOfMonths={1} // Use 1 month for simplicity, can be increased
          />
          <Separator className="my-4" />
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="compare-period"
              checked={draftCompareEnabled}
              onCheckedChange={setDraftCompareEnabled}
            />
            <Label htmlFor="compare-period" className="text-sm">Compare to previous period</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setPopoverOpen(false)}>Cancel</Button>
            <Button onClick={handleApply} disabled={!draftPrimaryRange?.from || !draftPrimaryRange?.to}>Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdvancedDateRangePicker;
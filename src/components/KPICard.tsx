import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  icon?: React.ElementType; // Lucide icon component, e.g., DollarSign, Users
  trendValue?: string; // The value of the trend, e.g., "20.1%", "5 units"
  trendDirection?: 'up' | 'down' | 'neutral'; // Determines icon and color for the trend
  trendDescription?: string; // Description for the trend, e.g., "since last month"
  isLoading?: boolean;
  className?: string; // Additional class names for the Card
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: IconComponent,
  trendValue,
  trendDirection,
  trendDescription,
  isLoading = false,
  className,
}) => {
  console.log('KPICard loaded for:', title);

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-3/5" /> {/* Placeholder for title */}
          {IconComponent && <Skeleton className="h-4 w-4 rounded-full" />} {/* Placeholder for icon */}
        </CardHeader>
        <CardContent className="py-2">
          <Skeleton className="h-8 w-4/5 mb-2" /> {/* Placeholder for value */}
          {(trendValue || trendDescription) && <Skeleton className="h-4 w-1/2" />} {/* Placeholder for trend line */}
        </CardContent>
      </Card>
    );
  }

  let trendVisualClasses = "";
  switch (trendDirection) {
    case 'up':
      trendVisualClasses = "text-green-600 dark:text-green-500";
      break;
    case 'down':
      trendVisualClasses = "text-red-600 dark:text-red-500";
      break;
    case 'neutral':
      trendVisualClasses = "text-gray-600 dark:text-gray-400";
      break;
    default:
      // If trendValue is provided without direction, it will be standard text color
      break;
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {IconComponent && <IconComponent className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="py-2">
        <div className="text-2xl font-bold">{value}</div>
        {(trendValue || trendDescription) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center flex-wrap">
            {trendValue && trendDirection && (
              <span className={cn("flex items-center font-semibold", trendVisualClasses)}>
                {trendDirection === 'up' && <ArrowUp className="h-3 w-3 mr-0.5 flex-shrink-0" />}
                {trendDirection === 'down' && <ArrowDown className="h-3 w-3 mr-0.5 flex-shrink-0" />}
                {trendDirection === 'neutral' && <Minus className="h-3 w-3 mr-0.5 flex-shrink-0" />}
                {trendValue}
              </span>
            )}
            {/* If trendValue is present but no direction, display it normally */}
            {trendValue && !trendDirection && (
                <span className="font-semibold">{trendValue}</span>
            )}
            {trendDescription && (
              <span className={cn( (trendValue) ? 'ml-1' : '' )}>
                {trendDescription}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;
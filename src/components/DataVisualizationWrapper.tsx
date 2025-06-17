import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Assuming utils.ts exists for cn

interface DataVisualizationWrapperProps {
  title: string;
  children: ReactNode; // The chart component itself
  actions?: ReactNode; // Optional slot for action buttons (e.g., export, filter controls)
  className?: string; // For additional custom styling on the Card
  chartContainerClassName?: string; // For styling the direct container of the chart
  chartHeight?: string | number; // To customize chart container height e.g. "300px" or 300
}

const DataVisualizationWrapper: React.FC<DataVisualizationWrapperProps> = ({
  title,
  children,
  actions,
  className,
  chartContainerClassName,
  chartHeight = "300px", // Default height for the chart area
}) => {
  console.log(`DataVisualizationWrapper loaded with title: ${title}`);

  const heightStyle = typeof chartHeight === 'number' ? { height: `${chartHeight}px` } : { height: chartHeight };

  return (
    <Card className={cn("w-full flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </CardHeader>
      <CardContent className={cn("p-4 flex-grow", chartContainerClassName)} style={heightStyle}>
        {/* The actual chart component is passed as children and rendered here */}
        {children}
      </CardContent>
      {/* CardFooter could be added here if needed for legends or summary information */}
    </Card>
  );
};

export default DataVisualizationWrapper;
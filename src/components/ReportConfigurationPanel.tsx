import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import AdvancedDateRangePicker from '@/components/AdvancedDateRangePicker'; // Assuming this component exists
import { useToast } from '@/components/ui/use-toast';
import { FileText, RotateCcw } from 'lucide-react';

const reportConfigSchema = z.object({
  metrics: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'Please select at least one metric.',
  }),
  groupBy: z.string().optional(),
  segmentBy: z.string().optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
    // It's assumed AdvancedDateRangePicker provides an object like this
    // or a string for predefined ranges. For this example, we'll expect { from?: Date, to?: Date }
  }).optional(),
  productName: z.string().optional().default(''),
  category: z.string().optional(),
  orderStatus: z.string().optional(),
  reportFormat: z.enum(['PDF', 'CSV', 'XLSX'], {
    required_error: 'You need to select a report format.',
  }),
});

type ReportConfigFormValues = z.infer<typeof reportConfigSchema>;

interface ReportConfigurationPanelProps {
  onSubmit?: (data: ReportConfigFormValues) => void;
  defaultValues?: Partial<ReportConfigFormValues>;
}

const metricOptions = [
  { id: 'totalSales', label: 'Total Sales' },
  { id: 'averageOrderValue', label: 'Average Order Value' },
  { id: 'conversionRate', label: 'Conversion Rate' },
  { id: 'newCustomers', label: 'New Customers' },
  { id: 'itemsPerOrder', label: 'Items Per Order' },
];

const dimensionOptions = [
  { value: 'none', label: 'None' },
  { value: 'product', label: 'Product' },
  { value: 'category', label: 'Product Category' },
  { value: 'region', label: 'Region/Country' },
  { value: 'salesChannel', label: 'Sales Channel' },
  { value: 'customerSegment', label: 'Customer Segment' },
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const categoryFilterOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'homeGoods', label: 'Home Goods' },
  { value: 'books', label: 'Books & Media' },
  { value: 'healthBeauty', label: 'Health & Beauty' },
];

const orderStatusFilterOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

const reportFormatOptions = [
  { value: 'PDF', label: 'PDF' },
  { value: 'CSV', label: 'CSV' },
  { value: 'XLSX', label: 'Excel (XLSX)' },
];

const ReportConfigurationPanel: React.FC<ReportConfigurationPanelProps> = ({
  onSubmit,
  defaultValues,
}) => {
  const { toast } = useToast();
  console.log('ReportConfigurationPanel loaded');

  const form = useForm<ReportConfigFormValues>({
    resolver: zodResolver(reportConfigSchema),
    defaultValues: {
      metrics: [],
      groupBy: 'none',
      segmentBy: 'none',
      productName: '',
      category: 'all',
      orderStatus: 'all',
      reportFormat: 'PDF',
      dateRange: { from: undefined, to: undefined },
      ...defaultValues,
    },
  });

  const handleFormSubmit = (data: ReportConfigFormValues) => {
    console.log('Report Configuration Data:', data);
    if (onSubmit) {
      onSubmit(data);
    }
    toast({
      title: 'Report Generation Started',
      description: `Your ${data.reportFormat} report is being generated with the selected parameters.`,
    });
  };

  const handleReset = () => {
    form.reset({
      metrics: [],
      groupBy: 'none',
      segmentBy: 'none',
      productName: '',
      category: 'all',
      orderStatus: 'all',
      reportFormat: 'PDF',
      dateRange: { from: undefined, to: undefined },
      ...defaultValues,
    });
    toast({
      title: 'Form Reset',
      description: 'Report configuration has been reset to defaults.',
    });
  };


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Configure Custom Report</CardTitle>
        <CardDescription>
          Define the parameters for your report. Select metrics, dimensions, filters, and output format.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="metrics"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base">Metrics</FormLabel>
                  <FormDescription>Select the metrics to include in the report.</FormDescription>
                  <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-3">
                    {metricOptions.map((metric) => (
                      <FormField
                        key={metric.id}
                        control={form.control}
                        name="metrics"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={metric.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(metric.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), metric.id])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== metric.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{metric.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="groupBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group By</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a dimension to group by" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dimensionOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="segmentBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segment By (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a dimension to segment by" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dimensionOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Range</FormLabel>
                    <AdvancedDateRangePicker
                      // Assuming AdvancedDateRangePicker accepts a value like { from: Date, to: Date }
                      // and an onDateChange callback with the same structure.
                      // The actual props might differ based on AdvancedDateRangePicker's implementation.
                      value={field.value}
                      onDateChange={(newRange: { from?: Date; to?: Date }) => field.onChange(newRange)}
                      // Placeholder for other necessary props:
                      // e.g. initialVisibleMonth={new Date()}
                      // e.g. disabledDates={[]}
                    />
                  <FormDescription>Select the period for the report.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <fieldset className="space-y-4 p-4 border rounded-md">
              <legend className="text-sm font-medium px-1">Filters</legend>
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name/SKU (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Laptop Pro X1' or 'SKU12345'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryFilterOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orderStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an order status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {orderStatusFilterOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>

            <FormField
              control={form.control}
              name="reportFormat"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base">Report Format</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      {reportFormatOptions.map((format) => (
                        <FormItem key={format.value} className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={format.value} />
                          </FormControl>
                          <FormLabel className="font-normal">{format.label}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button type="submit">
              <FileText className="mr-2 h-4 w-4" /> Generate Report
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ReportConfigurationPanel;
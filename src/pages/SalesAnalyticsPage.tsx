import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Though Sidebar handles most navigation

// Custom Components
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import AdvancedDateRangePicker, { AdvancedDateRangePickerValue } from '@/components/AdvancedDateRangePicker';
import DataVisualizationWrapper from '@/components/DataVisualizationWrapper';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input'; // For potential table search

// lucide-react Icons
import { Download, Filter, Search as SearchIcon, AreaChart, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

// Recharts
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// Placeholder Data
const initialSalesTrendData = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'May', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
  { name: 'Jul', revenue: 3490, profit: 4300 },
];

const initialRevenueByCategoryData = [
  { name: 'Electronics', revenue: 12500 },
  { name: 'Apparel', revenue: 8200 },
  { name: 'Home Goods', revenue: 6700 },
  { name: 'Books', revenue: 4100 },
  { name: 'Beauty', revenue: 3500 },
];

const initialSalesByChannelData = [
  { name: 'Online Store', value: 22000 },
  { name: 'Retail POS', value: 15500 },
  { name: 'Marketplaces', value: 9000 },
  { name: 'Social Media', value: 4500 },
];
const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF'];

const initialTableData = [
  { id: '1', date: '2023-07-15', product: 'Laptop Pro X1', category: 'Electronics', channel: 'Online Store', revenue: 1200, units: 1, status: 'Delivered' },
  { id: '2', date: '2023-07-14', product: 'Running Shoes A2', category: 'Apparel', channel: 'Retail POS', revenue: 89, units: 1, status: 'Delivered' },
  { id: '3', date: '2023-07-14', product: 'Smart Coffee Maker', category: 'Home Goods', channel: 'Marketplaces', revenue: 150, units: 1, status: 'Shipped' },
  { id: '4', date: '2023-07-13', product: 'History of Time Vol. 2', category: 'Books', channel: 'Online Store', revenue: 25, units: 1, status: 'Processing' },
  { id: '5', date: '2023-07-12', product: 'Organic Face Serum', category: 'Beauty', channel: 'Online Store', revenue: 45, units: 2, status: 'Delivered' },
  { id: '6', date: '2023-07-11', product: 'Wireless Earbuds Z', category: 'Electronics', channel: 'Retail POS', revenue: 199, units: 1, status: 'Cancelled' },
  { id: '7', date: '2023-07-10', product: 'Yoga Mat Premium', category: 'Home Goods', channel: 'Social Media', revenue: 35, units: 1, status: 'Delivered' },
  { id: '8', date: '2023-07-09', product: 'T-Shirt Basic Cotton', category: 'Apparel', channel: 'Online Store', revenue: 20, units: 3, status: 'Shipped' },
  { id: '9', date: '2023-07-08', product: 'Tablet UltraSlim 10', category: 'Electronics', channel: 'Marketplaces', revenue: 350, units: 1, status: 'Delivered' },
  { id: '10', date: '2023-07-07', product: 'Mystery Novel X', category: 'Books', channel: 'Retail POS', revenue: 15, units: 1, status: 'Processing' },
  { id: '11', date: '2023-07-06', product: 'Advanced Night Cream', category: 'Beauty', channel: 'Online Store', revenue: 75, units: 1, status: 'Delivered' },
  { id: '12', date: '2023-07-05', product: 'External SSD 1TB', category: 'Electronics', channel: 'Online Store', revenue: 120, units: 1, status: 'Shipped' },
];

const SalesAnalyticsPage = () => {
  console.log('SalesAnalyticsPage loaded');

  const [dateRange, setDateRange] = useState<AdvancedDateRangePickerValue>(() => {
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 29);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(today);
    toDate.setHours(23, 59, 59, 999);
    return {
      primary: { from: fromDate, to: toDate },
      presetLabel: 'Last 30 days',
      isCompareEnabled: false,
    };
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Memoized filtered data for charts and table (basic filtering example)
  const filteredData = useMemo(() => {
    let data = initialTableData;
    if (selectedCategory !== 'all') {
      data = data.filter(item => item.category === selectedCategory);
    }
    if (selectedChannel !== 'all') {
      data = data.filter(item => item.channel === selectedChannel);
    }
    if (searchTerm) {
      data = data.filter(item => 
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Date range filtering would be more complex, involving parsing `dateRange`
    // For this placeholder, we are not dynamically filtering by date.
    return data;
  }, [selectedCategory, selectedChannel, searchTerm /*, dateRange (add if implementing date filtering) */]);

  // Pagination for Table
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedTableData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleApplyFilters = () => {
    console.log("Applying filters:", { dateRange, selectedCategory, selectedChannel });
    // In a real app, this would trigger data fetching or recalculation
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleExport = () => {
    console.log("Exporting data with current filters...");
    // Placeholder for export functionality
  };

  return (
    <div className="flex h-screen bg-muted/40">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-64"> {/* Adjust ml-64 if sidebar width changes */}
        <Header />
        <ScrollArea className="flex-1">
          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Page Title & Top Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Sales Analytics</h1>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export Data
              </Button>
            </div>

            {/* Filter Bar Card */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Adjust the parameters to refine your sales data analysis.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-end gap-4">
                <AdvancedDateRangePicker value={dateRange} onValueChange={setDateRange} />
                
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Category</span>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Apparel">Apparel</SelectItem>
                      <SelectItem value="Home Goods">Home Goods</SelectItem>
                      <SelectItem value="Books">Books</SelectItem>
                      <SelectItem value="Beauty">Beauty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Channel</span>
                  <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="Online Store">Online Store</SelectItem>
                      <SelectItem value="Retail POS">Retail POS</SelectItem>
                      <SelectItem value="Marketplaces">Marketplaces</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleApplyFilters} className="self-end">
                  <Filter className="mr-2 h-4 w-4" /> Apply Filters
                </Button>
              </CardContent>
            </Card>

            {/* Charts Section (Grid) */}
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <DataVisualizationWrapper title="Sales Trend (Revenue)" chartHeight="350px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={initialSalesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </DataVisualizationWrapper>

              <DataVisualizationWrapper title="Revenue by Product Category" chartHeight="350px">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={initialRevenueByCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </DataVisualizationWrapper>
              
              <DataVisualizationWrapper title="Sales by Channel" chartHeight="350px" className="md:col-span-2 xl:col-span-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={initialSalesByChannelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {initialSalesByChannelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </DataVisualizationWrapper>
            </section>

            {/* Data Table Section */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Sales Transactions</CardTitle>
                <CardDescription>
                  Browse and search through individual sales records. Displaying {paginatedTableData.length} of {filteredData.length} records.
                </CardDescription>
                 <div className="relative mt-2">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by product or ID..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Units</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTableData.length > 0 ? (
                        paginatedTableData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.product}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.channel}</TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell className="text-right">{item.units}</TableCell>
                            <TableCell className="text-right">${item.revenue.toFixed(2)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center">
                            No sales data available for the selected filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <Pagination className="mt-6 justify-center">
                    <PaginationContent>
                      <PaginationItem>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                      </PaginationItem>
                      {/* Simple page numbers - for more complex, generate array of page numbers */}
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i + 1}>
                           <Button 
                            variant={currentPage === i + 1 ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </Button>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                         <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </CardContent>
            </Card>
          </main>
        </ScrollArea>
        <Footer />
      </div>
    </div>
  );
};

export default SalesAnalyticsPage;
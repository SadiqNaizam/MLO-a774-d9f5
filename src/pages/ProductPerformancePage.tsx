import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Though not directly used, good for context if needed

// Custom Layout Components
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

// Custom UI Components
import AdvancedDateRangePicker, { AdvancedDateRangePickerValue } from '@/components/AdvancedDateRangePicker';
import DataVisualizationWrapper from '@/components/DataVisualizationWrapper';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// lucide-react Icons
import { Search } from 'lucide-react';

// Recharts for DataVisualizationWrapper
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ProductData {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitsSold: number;
  revenue: number;
  profitMargin: number; // as percentage
  views?: number;
  conversionRate?: number; // as percentage
  inventory?: number;
}

const sampleProducts: ProductData[] = [
  { id: '1', name: 'Eco-Friendly Water Bottle', sku: 'SKU001', category: 'Home Goods', unitsSold: 1200, revenue: 24000, profitMargin: 40, views: 5000, conversionRate: 5, inventory: 200 },
  { id: '2', name: 'Organic Cotton T-Shirt', sku: 'SKU002', category: 'Apparel', unitsSold: 850, revenue: 21250, profitMargin: 35, views: 4200, conversionRate: 4.5, inventory: 150 },
  { id: '3', name: 'Smart LED Bulb', sku: 'SKU003', category: 'Electronics', unitsSold: 600, revenue: 15000, profitMargin: 50, views: 6000, conversionRate: 6, inventory: 300 },
  { id: '4', name: 'Wireless Noise-Cancelling Headphones', sku: 'SKU004', category: 'Electronics', unitsSold: 450, revenue: 67500, profitMargin: 45, views: 7500, conversionRate: 7, inventory: 80 },
  { id: '5', name: 'Premium Yoga Mat', sku: 'SKU005', category: 'Sports & Outdoors', unitsSold: 700, revenue: 28000, profitMargin: 30, views: 3000, conversionRate: 3.8, inventory: 120 },
  { id: '6', name: 'Advanced Coffee Maker', sku: 'SKU006', category: 'Home Goods', unitsSold: 300, revenue: 30000, profitMargin: 55, views: 4800, conversionRate: 5.5, inventory: 50 },
  { id: '7', name: 'Pro Running Shoes Model X', sku: 'SKU007', category: 'Apparel', unitsSold: 950, revenue: 76000, profitMargin: 40, views: 8000, conversionRate: 6.5, inventory: 100 },
  { id: '8', name: 'Ergonomic Office Chair', sku: 'SKU008', category: 'Furniture', unitsSold: 150, revenue: 22500, profitMargin: 38, views: 2500, conversionRate: 3, inventory: 40 },
  { id: '9', name: 'Ultra HD 4K Monitor', sku: 'SKU009', category: 'Electronics', unitsSold: 250, revenue: 75000, profitMargin: 42, views: 6500, conversionRate: 6.8, inventory: 60 },
  { id: '10', name: 'Natural Skin Care Set', sku: 'SKU010', category: 'Beauty', unitsSold: 1100, revenue: 33000, profitMargin: 48, views: 5500, conversionRate: 5.2, inventory: 180 },
];

const ProductPerformancePage = () => {
  console.log('ProductPerformancePage loaded');

  const [dateRange, setDateRange] = useState<AdvancedDateRangePickerValue | undefined>(() => {
    const today = new Date();
    const fromDate = new Date(new Date().setDate(today.getDate() - 29)); // Last 30 days
    return {
      primary: { from: fromDate, to: today },
      presetLabel: 'Last 30 days',
      isCompareEnabled: false,
    };
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const handleApplyFilters = () => {
    console.log('Applying filters:', { dateRange, searchTerm });
    // In a real app, this would trigger a data fetch or re-filter client-side data
    setCurrentPage(1); // Reset to first page on new filter application
  };
  
  // Effect to log when filters change (simulating data refetch trigger)
  useEffect(() => {
    console.log('Filters changed. Current state:', { dateRange, searchTerm, currentPage });
    // This is where you might fetch data based on new filters.
  }, [dateRange, searchTerm, currentPage]);


  const filteredProducts = useMemo(() => {
    return sampleProducts.filter(product =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      // Add date range filtering logic here if data has timestamps
    );
  }, [searchTerm/*, dateRange*/]); // dateRange dependency if filtering by date

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const chartData = useMemo(() => {
    return filteredProducts
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5) // Top 5 products
      .map(p => ({ 
        name: p.name.length > 20 ? p.name.substring(0, 17) + '...' : p.name, 
        Revenue: p.revenue 
      }));
  }, [filteredProducts]);

  const renderPaginationItems = () => {
    const pageItems = [];
    const maxPagesToShow = 5; // Max direct page links shown (e.g., 1 ... 4 5 6 ... 10)
    const ellipsis = <PaginationItem key="ellipsis-placeholder"><PaginationEllipsis /></PaginationItem>; // Placeholder

    if (totalPages <= maxPagesToShow + 2) { // Show all pages if not too many
      for (let i = 1; i <= totalPages; i++) {
        pageItems.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(i); }} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      pageItems.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(1); }} isActive={currentPage === 1}>1</PaginationLink>
        </PaginationItem>
      );

      // Ellipsis or pages after first
      if (currentPage > 3) {
        pageItems.push(<PaginationItem key="start-ellipsis">{ellipsis}</PaginationItem>);
      }

      // Pages around current
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
         if (i === 1 || i === totalPages) continue; // Already handled or will be
        pageItems.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(i); }} isActive={currentPage === i}>{i}</PaginationLink>
          </PaginationItem>
        );
      }
      
      // Ellipsis or pages before last
      if (currentPage < totalPages - 2) {
         pageItems.push(<PaginationItem key="end-ellipsis">{ellipsis}</PaginationItem>);
      }

      // Always show last page
      pageItems.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(totalPages); }} isActive={currentPage === totalPages}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }
    return pageItems;
  };


  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64"> {/* Adjust pl-64 if sidebar width changes */}
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/30">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Product Performance</h1>
            <p className="text-muted-foreground">
              Analyze sales, engagement, and profitability of your products.
            </p>
          </div>

          {/* Filters Section */}
          <Card className="mb-6 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Filters &amp; Search</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
              <AdvancedDateRangePicker 
                value={dateRange} 
                onValueChange={setDateRange} 
              />
              <Input
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-full sm:max-w-xs"
              />
              <Button onClick={handleApplyFilters}>
                <Search className="mr-2 h-4 w-4" /> Apply Filters
              </Button>
            </CardContent>
          </Card>

          {/* Product Performance Chart */}
          {chartData.length > 0 && (
            <DataVisualizationWrapper 
              title="Top 5 Products by Revenue" 
              className="mb-6 shadow-sm" 
              chartHeight="380px"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                    height={80} // Increased height for angled labels
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${Number(value)/1000}k`}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    stroke="hsl(var(--border))"
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </DataVisualizationWrapper>
          )}

          {/* Product Table Section */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Product Details</CardTitle>
              {/* Optional: Export button or other actions */}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Profit Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">{product.unitsSold.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-green-600">{product.profitMargin}%</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No products match your current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {totalPages > 1 && (
              <CardFooter className="flex justify-center md:justify-end border-t pt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                      />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            )}
          </Card>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ProductPerformancePage;
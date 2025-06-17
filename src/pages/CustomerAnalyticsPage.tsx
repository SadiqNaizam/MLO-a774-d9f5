import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import AdvancedDateRangePicker, { AdvancedDateRangePickerValue } from '@/components/AdvancedDateRangePicker';
import DataVisualizationWrapper from '@/components/DataVisualizationWrapper';
import KPICard from '@/components/KPICard';

// Shadcn/ui Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Recharts for Charts
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Lucide Icons
import { Users, TrendingUp, DollarSign, UserMinus, Filter } from 'lucide-react';

// Helper to get initial date range (e.g., Last 30 days)
const getInitialDateRange = (): AdvancedDateRangePickerValue => {
  const today = new Date();
  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - 29);
  fromDate.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  return {
    primary: { from: fromDate, to: today },
    presetLabel: 'Last 30 days',
    isCompareEnabled: false,
  };
};

// Placeholder Data
const customerDataSample = [
  { id: 'CUST001', name: 'Alice Wonderland', email: 'alice@example.com', segment: 'High Value', lifetimeValue: 1250.75, totalOrders: 15, lastOrderDate: '2023-05-15' },
  { id: 'CUST002', name: 'Bob The Builder', email: 'bob@example.com', segment: 'New', lifetimeValue: 150.00, totalOrders: 2, lastOrderDate: '2023-06-01' },
  { id: 'CUST003', name: 'Charlie Brown', email: 'charlie@example.com', segment: 'At Risk', lifetimeValue: 450.50, totalOrders: 8, lastOrderDate: '2023-03-20' },
  { id: 'CUST004', name: 'Diana Prince', email: 'diana@example.com', segment: 'Loyal', lifetimeValue: 800.20, totalOrders: 12, lastOrderDate: '2023-05-28' },
  { id: 'CUST005', name: 'Edward Scissorhands', email: 'edward@example.com', segment: 'High Value', lifetimeValue: 2100.00, totalOrders: 25, lastOrderDate: '2023-06-05' },
];

const newReturningData = [
  { name: 'Jan', new: 40, returning: 60 },
  { name: 'Feb', new: 50, returning: 70 },
  { name: 'Mar', new: 45, returning: 65 },
  { name: 'Apr', new: 60, returning: 80 },
];

const clvTrendData = [
  { month: 'Jan', clv: 220 },
  { month: 'Feb', clv: 240 },
  { month: 'Mar', clv: 230 },
  { month: 'Apr', clv: 270 },
  { month: 'May', clv: 290 },
];

const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomerAnalyticsPage = () => {
  console.log('CustomerAnalyticsPage loaded');

  const [dateRange, setDateRange] = useState<AdvancedDateRangePickerValue>(getInitialDateRange());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Example, can be dynamic

  // TODO: Filter data based on dateRange and other filters
  const displayedCustomers = customerDataSample.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(customerDataSample.length / itemsPerPage);

  const handleDateChange = (newDateRange: AdvancedDateRangePickerValue) => {
    setDateRange(newDateRange);
    console.log('Date range updated:', newDateRange);
    // Here you would typically refetch data or filter existing data
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-800">
      <Header />
      <div className="flex flex-1 pt-16"> {/* Header height */}
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-64"> {/* Sidebar width */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Customer Analytics</h1>
            <AdvancedDateRangePicker
              value={dateRange}
              onValueChange={handleDateChange}
            />
          </div>

          {/* Key Metrics Section */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            <KPICard
              title="Total Customers"
              value="1,280"
              icon={Users}
              trendValue="+5.2%"
              trendDirection="up"
              trendDescription="vs last period"
            />
            <KPICard
              title="Avg. CLV"
              value="$480.50"
              icon={DollarSign}
              trendValue="+$12.30"
              trendDirection="up"
              trendDescription="vs last period"
            />
            <KPICard
              title="New Customers"
              value="150"
              icon={Users} // Could use UserPlus if available
              trendValue="+10"
              trendDirection="up"
              trendDescription="this month"
            />
            <KPICard
              title="Churn Rate"
              value="5.8%"
              icon={UserMinus}
              trendValue="-0.5%"
              trendDirection="down" // Lower churn is good
              trendDescription="vs last period"
            />
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            <DataVisualizationWrapper title="New vs. Returning Customers" chartHeight="350px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={newReturningData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="new" fill="#8884d8" name="New Customers" />
                  <Bar dataKey="returning" fill="#82ca9d" name="Returning Customers" />
                </BarChart>
              </ResponsiveContainer>
            </DataVisualizationWrapper>
            <DataVisualizationWrapper title="Customer Lifetime Value (CLV) Trend" chartHeight="350px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={clvTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="clv" stroke="#8884d8" name="Average CLV" />
                </LineChart>
              </ResponsiveContainer>
            </DataVisualizationWrapper>
          </section>
          
          {/* Customer Segmentation & Filters */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <CardTitle>Customer Segments</CardTitle>
                  <CardDescription>Analyze customer groups based on behavior and value.</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Apply Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select Segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Segments</SelectItem>
                  <SelectItem value="high_value">High Value</SelectItem>
                  <SelectItem value="loyal">Loyal</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
                  <SelectItem value="churned">Churned</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Purchase Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Frequency</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="north_america">North America</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            {/* Optionally, show a small pie chart for segment distribution */}
             <CardContent>
                <DataVisualizationWrapper title="Segment Distribution (Example)" chartHeight="250px">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'High Value', value: 400 },
                                    { name: 'Loyal', value: 300 },
                                    { name: 'New', value: 300 },
                                    { name: 'At Risk', value: 200 },
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {[
                                    { name: 'High Value', value: 400 },
                                    { name: 'Loyal', value: 300 },
                                    { name: 'New', value: 300 },
                                    { name: 'At Risk', value: 200 },
                                ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </DataVisualizationWrapper>
            </CardContent>
          </Card>


          {/* Top Customers Table Section */}
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>Detailed view of customers. (Displaying {displayedCustomers.length} of {customerDataSample.length} customers)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Segment</TableHead>
                      <TableHead className="text-right">Lifetime Value</TableHead>
                      <TableHead className="text-right">Total Orders</TableHead>
                      <TableHead>Last Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedCustomers.length > 0 ? displayedCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.id}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>
                           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            customer.segment === 'High Value' ? 'bg-green-100 text-green-700' :
                            customer.segment === 'Loyal' ? 'bg-blue-100 text-blue-700' :
                            customer.segment === 'New' ? 'bg-yellow-100 text-yellow-700' :
                            customer.segment === 'At Risk' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                           }`}>
                            {customer.segment}
                           </span>
                        </TableCell>
                        <TableCell className="text-right">${customer.lifetimeValue.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{customer.totalOrders}</TableCell>
                        <TableCell>{customer.lastOrderDate}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">No customers found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <Pagination className="mt-6 justify-center">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(Math.max(1, currentPage - 1)); }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      // Simplified pagination: show first, last, current, and +/- 1 around current
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        (pageNum === currentPage - 2 && currentPage > 3) ||
                        (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                      ) {
                        return <PaginationEllipsis key={`ellipsis-${pageNum}`} />;
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(Math.min(totalPages, currentPage + 1)); }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerAnalyticsPage;
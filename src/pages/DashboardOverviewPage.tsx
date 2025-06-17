import React from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import KPICard from '@/components/KPICard';
import DataVisualizationWrapper from '@/components/DataVisualizationWrapper';
import Footer from '@/components/layout/Footer';

// Shadcn/ui Components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Lucide Icons
import { DollarSign, ShoppingCart, Receipt, Percent, Users } from 'lucide-react';

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// Placeholder data for charts
const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const customerAcquisitionData = [
  { name: 'Jan', newCustomers: 50 },
  { name: 'Feb', newCustomers: 70 },
  { name: 'Mar', newCustomers: 60 },
  { name: 'Apr', newCustomers: 90 },
  { name: 'May', newCustomers: 80 },
  { name: 'Jun', newCustomers: 110 },
];

const DashboardOverviewPage = () => {
  console.log('DashboardOverviewPage loaded');

  return (
    <div className="flex min-h-screen bg-background dark:bg-muted/40"> {/* Main flex container */}
      <Sidebar /> {/* Fixed, w-64. Out of flex flow. */}
      
      {/* Content wrapper offset by sidebar width */}
      <div className="ml-64 flex flex-1 flex-col"> {/* ml-64 for sidebar. flex-1 to take remaining width. flex-col for Header, Main, Footer. */}
        <Header /> {/* Sticky, h-16 (4rem). Sticks to viewport top. */}
        
        {/* Scrollable main content area. Needs padding-top to avoid being obscured by sticky Header. */}
        <main className="flex-1 overflow-y-auto p-6 pt-[calc(4rem+1.5rem)]"> {/* 4rem header height + 1.5rem top padding for content */}
          
          {/* KPI Cards Section */}
          <section aria-labelledby="kpi-title" className="mb-8">
            <h2 id="kpi-title" className="text-2xl font-semibold text-foreground mb-4">
              Key Performance Indicators
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <KPICard 
                title="Total Sales" 
                value="$125,670.00" 
                trendValue="+12.5%" 
                trendDirection="up" 
                trendDescription="vs last month" 
                icon={DollarSign} 
                isLoading={false} 
              />
              <KPICard 
                title="Total Orders" 
                value="3,450" 
                trendValue="+8.2%" 
                trendDirection="up" 
                trendDescription="vs last month" 
                icon={ShoppingCart} 
                isLoading={false} 
              />
              <KPICard 
                title="Avg. Order Value" 
                value="$36.43" 
                trendValue="-1.5%" 
                trendDirection="down" 
                trendDescription="vs last month" 
                icon={Receipt} 
                isLoading={false} 
              />
              <KPICard 
                title="Conversion Rate" 
                value="4.75%" 
                trendValue="+0.5%" 
                trendDirection="up" 
                trendDescription="vs last month" 
                icon={Percent} 
                isLoading={false} 
              />
              <KPICard 
                title="Active Customers" 
                value="1,230" 
                trendValue="+50" 
                trendDirection="neutral" // Using neutral as per example data structure, could be 'up'
                trendDescription="this month" 
                icon={Users} 
                isLoading={false} 
              />
            </div>
          </section>

          {/* Charts Section */}
          <section aria-labelledby="charts-title" className="mb-8">
            <h2 id="charts-title" className="text-2xl font-semibold text-foreground mb-4">
              Visual Insights
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <DataVisualizationWrapper title="Sales Overview (Last 7 Days)" chartHeight="350px">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/30" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend wrapperStyle={{ fontSize: "14px" }} />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" name="Sales ($)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </DataVisualizationWrapper>
              <DataVisualizationWrapper title="Customer Acquisition (Last 6 Months)" chartHeight="350px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerAcquisitionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/30" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend wrapperStyle={{ fontSize: "14px" }} />
                    <Line type="monotone" dataKey="newCustomers" stroke="hsl(var(--primary))" name="New Customers" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </DataVisualizationWrapper>
            </div>
          </section>
          
          {/* Additional Info/Quick Links Section */}
          <section aria-labelledby="quick-actions-title">
             <h2 id="quick-actions-title" className="text-2xl font-semibold text-foreground mb-4">
               Quick Actions
             </h2>
            <Card>
              <CardHeader>
                <CardTitle>Explore Further</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">Dive deeper into your data or manage your store settings.</p>
                <div>
                  <Link to="/reports" className="text-sm font-medium text-primary hover:underline">
                    View All Reports &rarr;
                  </Link>
                </div>
                <div>
                  <Link to="/product-performance" className="text-sm font-medium text-primary hover:underline">
                    Analyze Product Performance &rarr;
                  </Link>
                </div>
                <div>
                  <Link to="/sales-analytics" className="text-sm font-medium text-primary hover:underline">
                    Investigate Sales Trends &rarr;
                  </Link>
                </div>
                <div>
                  <Link to="/settings" className="text-sm font-medium text-primary hover:underline">
                    Go to Settings &rarr;
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

        </main>
        <Footer /> {/* Footer at the bottom of the flex-col, after scrollable main content */}
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
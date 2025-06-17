import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Package,
  FileText,
  Settings as SettingsIcon, // Renamed to avoid conflict if a page is named Settings
  Briefcase, // Icon for the placeholder logo/app name
} from 'lucide-react';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType; // Lucide icons are components
}

const navItems: NavItemProps[] = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/sales-analytics', label: 'Sales', icon: TrendingUp },
  { href: '/customer-analytics', label: 'Customers', icon: Users },
  { href: '/product-performance', label: 'Products', icon: Package },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  console.log('Sidebar loaded, current path:', location.pathname);

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-gray-900 text-white flex flex-col shadow-lg">
      {/* Header/Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700/50">
        <Link to="/" className="flex items-center group">
          <Briefcase className="h-8 w-8 mr-3 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
          <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-gray-200 transition-colors">Dashboard</h1>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow px-3 py-4 space-y-1.5 overflow-y-auto">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ease-in-out',
                  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900', // Focus styles
                  location.pathname === item.href
                    ? 'bg-indigo-600 text-white shadow-sm' // Active link
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white' // Inactive link
                )}
                aria-current={location.pathname === item.href ? 'page' : undefined}
              >
                <item.icon className={cn(
                  'h-5 w-5 mr-3 shrink-0',
                  location.pathname === item.href ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                 )} aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Optional Footer Section in Sidebar */}
      <div className="p-4 mt-auto border-t border-gray-700/50">
        {/* Example: User profile link or quick actions can go here */}
        <p className="text-xs text-center text-gray-500">
          &copy; {new Date().getFullYear()} Your Company
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
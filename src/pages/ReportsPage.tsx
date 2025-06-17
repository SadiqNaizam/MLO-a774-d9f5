import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import ReportConfigurationPanel from '@/components/ReportConfigurationPanel';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Download, FileText as FileTextIconLucide, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

// Placeholder data for reports table
interface ReportItem {
  id: string;
  reportName: string;
  generationDate: string;
  status: 'Completed' | 'Processing' | 'Failed';
  format: 'PDF' | 'CSV' | 'XLSX';
  downloadUrl?: string;
}

const sampleReports: ReportItem[] = [
  { id: '1', reportName: 'Q3 Sales Summary & Analysis', generationDate: '2023-10-15 10:30 AM', status: 'Completed', format: 'PDF', downloadUrl: '#' },
  { id: '2', reportName: 'Monthly Customer Acquisition Trends', generationDate: '2023-11-01 09:00 AM', status: 'Completed', format: 'CSV', downloadUrl: '#' },
  { id: '3', reportName: 'Product Performance - Electronics Category', generationDate: '2023-11-05 14:00 PM', status: 'Processing', format: 'XLSX' },
  { id: '4', reportName: 'Yearly Financial Overview (Draft)', generationDate: '2023-11-10 16:45 PM', status: 'Failed', format: 'PDF' },
  { id: '5', reportName: 'Marketing Campaign ROI - October', generationDate: '2023-11-12 11:20 AM', status: 'Completed', format: 'XLSX', downloadUrl: '#' },
  { id: '6', reportName: 'Inventory Stock Levels - Current', generationDate: '2023-11-14 08:15 AM', status: 'Completed', format: 'CSV', downloadUrl: '#' },
  { id: '7', reportName: 'User Engagement Report - Last 7 Days', generationDate: '2023-11-14 17:00 PM', status: 'Processing', format: 'PDF' },
];

const ITEMS_PER_PAGE = 5;

const ReportsPage = () => {
  console.log('ReportsPage loaded');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sampleReports.length / ITEMS_PER_PAGE);
  const currentReports = sampleReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleReportConfigSubmit = (data: any) => { // Type from ReportConfigurationPanel onSubmit (generic 'any' as type is internal to component)
    console.log('Report configuration submitted from ReportsPage:', data);
    // This is a placeholder. In a real app, you might trigger report generation
    // and potentially add the new report to a list with a 'Generating' status.
    alert(`Simulating generation of ${data.reportFormat} report with metrics: ${data.metrics?.join(', ') ?? 'N/A'}`);
  };

  const getStatusIcon = (status: ReportItem['status']) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />;
      case 'Processing':
        return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin flex-shrink-0" />;
      case 'Failed':
        return <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />;
      default:
        return null;
    }
  };
  
  const getFileIcon = (format: ReportItem['format']) => {
    // Using FileTextIconLucide as a generic file icon.
    // Could be extended with specific icons for PDF, CSV, XLSX if available.
    return <FileTextIconLucide className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />;
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-64"> {/* Adjust ml-64 if sidebar width changes (Sidebar.tsx has w-64) */}
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
          <section id="generate-report" aria-labelledby="generate-report-heading">
            {/* ReportConfigurationPanel is a custom component that includes its own Card styling and title */}
            <ReportConfigurationPanel onSubmit={handleReportConfigSubmit} />
          </section>

          <section id="previous-reports" aria-labelledby="previous-reports-heading">
            <Card>
              <CardHeader>
                <CardTitle id="previous-reports-heading">Previously Generated Reports</CardTitle>
                <CardDescription>
                  View, manage, and download your past reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentReports.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report Name</TableHead>
                          <TableHead>Generated</TableHead>
                          <TableHead>Format</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.reportName}</TableCell>
                            <TableCell>{report.generationDate}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getFileIcon(report.format)}
                                <span>{report.format}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(report.status)}
                                <span>{report.status}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {report.status === 'Completed' && report.downloadUrl ? (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={report.downloadUrl} download aria-label={`Download ${report.reportName}`}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </a>
                                </Button>
                              ) : report.status === 'Failed' ? (
                                 <Button variant="destructive" size="sm" disabled>Failed</Button>
                              ) : (
                                 <Button variant="outline" size="sm" disabled>Unavailable</Button>
                              )
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileTextIconLucide className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <p className="mt-2 text-sm">No reports generated yet.</p>
                    <p className="text-xs">Use the form above to generate your first report.</p>
                  </div>
                )}
              </CardContent>
              {totalPages > 1 && (
                <div className="p-4 border-t dark:border-gray-700">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                          aria-disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                                isActive={currentPage === page}
                                aria-current={currentPage === page ? "page" : undefined}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          (page === currentPage - 2 && page !== 1) ||
                          (page === currentPage + 2 && page !== totalPages)
                        ) {
                          // Ensure ellipsis isn't rendered if it's right next to an existing page number or first/last page
                          if ((page === currentPage - 2 && currentPage - 2 > 1) || (page === currentPage + 2 && currentPage + 2 < totalPages)) {
                             return <PaginationItem key={`ellipsis-${page}`}><PaginationEllipsis /></PaginationItem>;
                          }
                        }
                        return null;
                      })}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                          aria-disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </Card>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ReportsPage;
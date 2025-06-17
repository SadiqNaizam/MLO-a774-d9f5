import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';

// Custom Layout Components
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Used directly in some non-form contexts
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast'; // For form submission feedback

// Lucide Icons
import { UserCircle, BellDot, Palette, DatabaseZap, KeyRound, Trash2, PlusCircle } from 'lucide-react';

// Zod Schemas for Form Validation
const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, "Current password must be at least 8 characters."),
  newPassword: z.string().min(8, "New password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters."),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match.",
  path: ["confirmPassword"],
});
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
  systemAlerts: z.boolean().default(true),
});
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

const applicationFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.enum(['en', 'es', 'fr', 'de']).default('en'),
  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']).default('MM/DD/YYYY'),
});
type ApplicationFormValues = z.infer<typeof applicationFormSchema>;


const SettingsPage = () => {
  console.log('SettingsPage loaded');

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: 'Alex Johnson', // Placeholder
      email: 'alex.johnson@example.com', // Placeholder
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: false,
      systemAlerts: true,
    },
  });

  const applicationForm = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      theme: 'system',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
    },
  });

  function onSubmitProfile(data: ProfileFormValues) {
    console.log('Profile settings submitted:', data);
    toast({ title: 'Profile Updated', description: 'Your profile information has been saved.' });
  }

  function onSubmitPassword(data: PasswordFormValues) {
    console.log('Password change submitted:', data);
    toast({ title: 'Password Changed', description: 'Your password has been updated successfully.' });
    passwordForm.reset();
  }

  function onSubmitNotifications(data: NotificationsFormValues) {
    console.log('Notification settings submitted:', data);
    toast({ title: 'Notifications Updated', description: 'Your notification preferences have been saved.' });
  }

  function onSubmitApplication(data: ApplicationFormValues) {
    console.log('Application settings submitted:', data);
    toast({ title: 'Application Settings Updated', description: 'Your application preferences have been saved.' });
  }
  
  // Placeholder data for Data Sources
  const [dataSources, setDataSources] = React.useState([
    { id: 'ds1', name: 'Shopify Store', type: 'eCommerce Platform', status: 'Connected' },
    { id: 'ds2', name: 'Google Analytics GA4', type: 'Analytics', status: 'Connected' },
  ]);

  const handleRemoveDataSource = (id: string) => {
    setDataSources(prev => prev.filter(ds => ds.id !== id));
    toast({ title: "Data Source Removed", description: "The data source connection has been removed."});
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-64"> {/* ml-64 for sidebar width */}
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="profile"><UserCircle className="inline-block w-4 h-4 mr-2 sm:hidden md:inline-block" />Profile</TabsTrigger>
              <TabsTrigger value="notifications"><BellDot className="inline-block w-4 h-4 mr-2 sm:hidden md:inline-block" />Notifications</TabsTrigger>
              <TabsTrigger value="application"><Palette className="inline-block w-4 h-4 mr-2 sm:hidden md:inline-block" />Application</TabsTrigger>
              <TabsTrigger value="datasources"><DatabaseZap className="inline-block w-4 h-4 mr-2 sm:hidden md:inline-block" />Data Sources</TabsTrigger>
            </TabsList>

            {/* Profile Settings Tab */}
            <TabsContent value="profile" className="mt-6 space-y-6">
              <Card>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onSubmitProfile)}>
                    <CardHeader>
                      <CardTitle>Account Profile</CardTitle>
                      <CardDescription>Manage your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormDescription>This is the email associated with your account.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <Button type="submit">Save Profile</Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
              
              <Card>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>Update your account password. Choose a strong password.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter current password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter new password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm new password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <Button type="submit" variant="secondary"><KeyRound className="w-4 h-4 mr-2"/>Change Password</Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            {/* Notification Settings Tab */}
            <TabsContent value="notifications" className="mt-6">
              <Card>
                <Form {...notificationsForm}>
                  <form onSubmit={notificationsForm.handleSubmit(onSubmitNotifications)}>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Control how you receive updates and alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={notificationsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>Receive important updates via email.</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationsForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Push Notifications</FormLabel>
                              <FormDescription>Get real-time alerts on your device (if app supported).</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationsForm.control}
                        name="systemAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">System Alerts</FormLabel>
                              <FormDescription>Receive critical system messages and security alerts.</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <Button type="submit">Save Notifications</Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            {/* Application Settings Tab */}
            <TabsContent value="application" className="mt-6">
              <Card>
                <Form {...applicationForm}>
                  <form onSubmit={applicationForm.handleSubmit(onSubmitApplication)}>
                    <CardHeader>
                      <CardTitle>Application Preferences</CardTitle>
                      <CardDescription>Customize the look and feel of the application.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={applicationForm.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Theme</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a theme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System Default</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Choose your preferred color scheme.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={applicationForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="en">English (US)</SelectItem>
                                <SelectItem value="es">Español (Spanish)</SelectItem>
                                <SelectItem value="fr">Français (French)</SelectItem>
                                <SelectItem value="de">Deutsch (German)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Set your preferred language for the interface.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={applicationForm.control}
                        name="dateFormat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date Format</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select date format" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Choose how dates are displayed across the application.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <Button type="submit">Save Preferences</Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
            
            {/* Data Sources Tab */}
            <TabsContent value="datasources" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Source Connections</CardTitle>
                  <CardDescription>Manage connections to your various data sources.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dataSources.length === 0 && (
                    <p className="text-sm text-muted-foreground">No data sources connected yet.</p>
                  )}
                  {dataSources.map((ds) => (
                    <div key={ds.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-semibold">{ds.name}</p>
                        <p className="text-sm text-muted-foreground">{ds.type} - <span className={ds.status === 'Connected' ? 'text-green-600' : 'text-red-600'}>{ds.status}</span></p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveDataSource(ds.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                        <span className="sr-only">Remove {ds.name}</span>
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="outline">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Connect New Data Source
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

          </Tabs>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default SettingsPage;
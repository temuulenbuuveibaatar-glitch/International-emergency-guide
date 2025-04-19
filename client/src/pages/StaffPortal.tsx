import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

const yearlyReportSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  year: z.string().regex(/^\d{4}$/, { message: "Year must be 4 digits" }),
  description: z.string().optional(),
  fileUrl: z.string().min(1, { message: "Please upload a file" }),
});

const aboutUsSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z.string().min(10, { 
    message: "Content must be at least 10 characters" 
  }),
  isPublished: z.boolean().default(false),
});

export default function StaffPortal() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("yearly-reports");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // If not authenticated or not staff, redirect to home
  if (!user) {
    navigate("/auth");
    return null;
  }
  
  if (!user.isStaff) {
    navigate("/");
    return null;
  }

  // Form for yearly reports
  const reportForm = useForm<z.infer<typeof yearlyReportSchema>>({
    resolver: zodResolver(yearlyReportSchema),
    defaultValues: {
      title: "",
      year: new Date().getFullYear().toString(),
      description: "",
      fileUrl: "",
    },
  });

  // Form for about us content
  const aboutUsForm = useForm<z.infer<typeof aboutUsSchema>>({
    resolver: zodResolver(aboutUsSchema),
    defaultValues: {
      title: "",
      content: "",
      isPublished: false,
    },
  });

  // Query for yearly reports
  const {
    data: yearlyReports,
    isLoading: loadingReports,
    error: reportsError,
  } = useQuery({
    queryKey: ["/api/staff/yearly-reports"],
    queryFn: async () => {
      const response = await fetch("/api/yearly-reports");
      if (!response.ok) {
        throw new Error("Failed to load yearly reports");
      }
      return response.json();
    },
  });

  // Query for about us content
  const {
    data: aboutUsContent,
    isLoading: loadingAboutUs,
    error: aboutUsError,
  } = useQuery({
    queryKey: ["/api/staff/about-us"],
    queryFn: async () => {
      const response = await fetch("/api/staff/about-us");
      if (!response.ok) {
        throw new Error("Failed to load about us content");
      }
      return response.json();
    },
  });

  // Mutation for creating yearly report
  const createReportMutation = useMutation({
    mutationFn: async (data: z.infer<typeof yearlyReportSchema>) => {
      const response = await apiRequest("POST", "/api/staff/yearly-reports", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create yearly report");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Yearly report has been uploaded",
      });
      reportForm.reset();
      setSelectedFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for creating about us content
  const createAboutUsMutation = useMutation({
    mutationFn: async (data: z.infer<typeof aboutUsSchema>) => {
      const response = await apiRequest("POST", "/api/staff/about-us", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create about us content");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "About us content has been saved",
      });
      aboutUsForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/staff/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "File upload failed");
      }

      const data = await response.json();
      reportForm.setValue("fileUrl", data.fileUrl);
      setSelectedFile(file);
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "File upload failed",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onReportSubmit = (data: z.infer<typeof yearlyReportSchema>) => {
    createReportMutation.mutate(data);
  };

  const onAboutUsSubmit = (data: z.infer<typeof aboutUsSchema>) => {
    createAboutUsMutation.mutate(data);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Staff Portal</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="yearly-reports">Yearly Reports</TabsTrigger>
          <TabsTrigger value="about-us">About Us</TabsTrigger>
        </TabsList>

        <TabsContent value="yearly-reports">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload new report */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Yearly Report</CardTitle>
                <CardDescription>
                  Share the annual activity report for the Red Cross Committee
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...reportForm}>
                  <form
                    onSubmit={reportForm.handleSubmit(onReportSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={reportForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Annual Report 2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={reportForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input placeholder="2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={reportForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="A brief description of this report"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={reportForm.control}
                      name="fileUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Report Document</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(file);
                                  }
                                }}
                              />
                              {selectedFile && (
                                <p className="text-sm text-gray-500">
                                  Selected: {selectedFile.name}
                                </p>
                              )}
                              <input type="hidden" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload a PDF, DOC, or DOCX file (max 10MB)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={uploading || createReportMutation.isPending}
                    >
                      {(uploading || createReportMutation.isPending) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Upload Report
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Existing reports */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Yearly Reports</CardTitle>
                <CardDescription>
                  View and manage previously uploaded reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingReports ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : reportsError ? (
                  <div className="text-red-500 py-4">
                    Failed to load reports. Please try again.
                  </div>
                ) : yearlyReports?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No reports have been uploaded yet.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {yearlyReports?.map((report) => (
                      <li
                        key={report.id}
                        className="p-3 border rounded-md hover:bg-gray-50"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{report.title}</h3>
                            <p className="text-sm text-gray-500">
                              Year: {report.year}
                            </p>
                            {report.description && (
                              <p className="text-sm mt-1">
                                {report.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a
                                href={report.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View
                              </a>
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="about-us">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create new About Us content */}
            <Card>
              <CardHeader>
                <CardTitle>Create About Us Content</CardTitle>
                <CardDescription>
                  Add new information about the Red Cross Committee
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...aboutUsForm}>
                  <form
                    onSubmit={aboutUsForm.handleSubmit(onAboutUsSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={aboutUsForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Our Mission"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={aboutUsForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the section content"
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={aboutUsForm.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <FormLabel>Publish immediately</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={createAboutUsMutation.isPending}
                    >
                      {createAboutUsMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Content
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Existing About Us content */}
            <Card>
              <CardHeader>
                <CardTitle>Existing About Us Content</CardTitle>
                <CardDescription>
                  View and manage your About Us sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAboutUs ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : aboutUsError ? (
                  <div className="text-red-500 py-4">
                    Failed to load content. Please try again.
                  </div>
                ) : aboutUsContent?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No About Us content has been created yet.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {aboutUsContent?.map((item) => (
                      <li
                        key={item.id}
                        className="p-3 border rounded-md hover:bg-gray-50"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm mt-1">
                              {item.content.substring(0, 100)}
                              {item.content.length > 100 ? "..." : ""}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.isPublished ? (
                                <span className="text-green-600">Published</span>
                              ) : (
                                <span className="text-orange-600">Draft</span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Implement edit functionality
                                toast({
                                  title: "Edit",
                                  description: "Edit functionality coming soon",
                                });
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
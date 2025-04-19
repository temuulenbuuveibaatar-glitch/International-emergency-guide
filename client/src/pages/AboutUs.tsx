import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

// Define the AboutUs content type
interface AboutUsContent {
  id: number;
  title: string;
  content: string;
  lastUpdatedAt: string;
}

export default function AboutUs() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

  // Fetch published About Us content
  const {
    data: aboutUsContent,
    isLoading,
    error,
  } = useQuery<AboutUsContent[]>({
    queryKey: ["/api/about-us"],
    queryFn: async () => {
      const response = await fetch("/api/about-us");
      if (!response.ok) {
        throw new Error("Failed to fetch About Us content");
      }
      return response.json();
    },
  });

  // Query for yearly reports
  const {
    data: yearlyReports,
    isLoading: loadingReports,
    error: reportsError,
  } = useQuery({
    queryKey: ["/api/yearly-reports"],
    queryFn: async () => {
      const response = await fetch("/api/yearly-reports");
      if (!response.ok) {
        throw new Error("Failed to load yearly reports");
      }
      return response.json();
    },
  });

  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t("aboutUs.title")}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t("aboutUs.description")}
        </p>
        
        {/* Staff edit button */}
        {user?.isStaff && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation("/staff-portal")}
            >
              {t("aboutUs.editContent")}
            </Button>
          </div>
        )}
      </div>

      {/* About Us Content */}
      <div className="mb-16">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            {t("aboutUs.errorLoading")}
          </div>
        ) : aboutUsContent?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t("aboutUs.noContent")}
          </div>
        ) : (
          <div className="grid gap-12">
            {aboutUsContent?.map((section) => (
              <div key={section.id} className="prose lg:prose-xl max-w-none">
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <div className="whitespace-pre-line">{section.content}</div>
                <p className="text-sm text-gray-500 mt-4">
                  {t("aboutUs.lastUpdated")}:{" "}
                  {new Date(section.lastUpdatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Yearly Reports Section */}
      <div className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">{t("aboutUs.yearlyReports")}</h2>
        
        {loadingReports ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : reportsError ? (
          <div className="text-red-500 py-4">
            {t("aboutUs.errorLoadingReports")}
          </div>
        ) : yearlyReports?.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {t("aboutUs.noReports")}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {yearlyReports?.map((report) => (
              <div
                key={report.id}
                className="bg-white p-4 rounded-md shadow-sm border transition-transform hover:shadow-md hover:-translate-y-1"
              >
                <h3 className="font-semibold text-lg">{report.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{report.year}</p>
                {report.description && (
                  <p className="text-sm mb-4">{report.description}</p>
                )}
                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/90"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    ></path>
                  </svg>
                  {t("aboutUs.downloadReport")}
                </a>
              </div>
            ))}
          </div>
        )}
        
        {/* Staff upload button */}
        {user?.isStaff && (
          <div className="mt-6 text-center">
            <Button onClick={() => setLocation("/staff-portal")}>
              {t("aboutUs.uploadReport")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
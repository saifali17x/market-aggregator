import { useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminImport() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (
      selectedFile.type !== "text/csv" &&
      !selectedFile.name.endsWith(".csv")
    ) {
      toast.error("Please select a valid CSV file");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("csv", file);

      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch("/api/import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadResult(result);
      toast.success("CSV imported successfully!");

      // Clear file selection
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed: " + error.message);
      setUploadResult({ error: error.message });
    } finally {
      setUploading(false);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = `product_name,product_description,category,subcategory,brand,model,sku,price,currency,condition,availability,stock_quantity,images,url,seller_name,seller_website,seller_description,seller_rating,seller_total_ratings
iPhone 15 Pro Max,Latest iPhone with titanium design and A17 Pro chip,electronics,smartphones,Apple,iPhone 15 Pro Max,IP15PM256,1199.99,USD,new,in_stock,50,"https://example.com/iphone1.jpg,https://example.com/iphone2.jpg",https://example.com/iphone,TechStore,https://techstore.com,Premium electronics retailer,4.8,1247
Samsung Galaxy S24 Ultra,Flagship Android phone with S Pen and AI features,electronics,smartphones,Samsung,Galaxy S24 Ultra,GS24U512,1099.99,USD,new,in_stock,30,"https://example.com/galaxy1.jpg,https://example.com/galaxy2.jpg",https://example.com/galaxy,MobileWorld,https://mobileworld.com,Mobile devices specialist,4.6,892
MacBook Air M3,Ultra-thin laptop with Apple M3 chip,electronics,laptops,Apple,MacBook Air M3,MBA13M3,1099.99,USD,new,in_stock,25,"https://example.com/macbook1.jpg,https://example.com/macbook2.jpg",https://example.com/macbook,ComputerStore,https://computerstore.com,Computer and laptop specialist,4.9,2156`;

    const blob = new Blob([sampleData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-import.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>CSV Import - Admin Dashboard</title>
        <meta
          name="description"
          content="Import CSV data for market aggregator"
        />
      </Head>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <FileText className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">CSV Import</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Sample CSV Download */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Sample CSV Format
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Download the sample CSV file to see the required format and column
              structure.
            </p>
            <button
              onClick={downloadSampleCSV}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Sample CSV
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Upload CSV File
            </h3>

            {/* Drag & Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary-400 bg-primary-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />

              {file ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Selected file:{" "}
                    <span className="font-medium text-gray-900">
                      {file.name}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Drag and drop your CSV file here, or{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-primary-600 hover:text-primary-500 font-medium"
                    >
                      browse files
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports CSV files up to 10MB
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {/* Upload Button */}
            {file && (
              <div className="mt-6">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upload Results */}
        {uploadResult && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Import Results
              </h3>

              {uploadResult.error ? (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Import Failed
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        {uploadResult.error}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Import Successful
                      </h3>
                      <div className="text-sm text-green-700 mt-2 space-y-1">
                        <p>
                          Products created: {uploadResult.productsCreated || 0}
                        </p>
                        <p>
                          Sellers created: {uploadResult.sellersCreated || 0}
                        </p>
                        <p>
                          Listings created: {uploadResult.listingsCreated || 0}
                        </p>
                        {uploadResult.errors &&
                          uploadResult.errors.length > 0 && (
                            <div className="mt-2">
                              <p className="font-medium">Errors encountered:</p>
                              <ul className="list-disc list-inside mt-1">
                                {uploadResult.errors.map((error, index) => (
                                  <li key={index} className="text-xs">
                                    Row {error.row}: {error.message}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

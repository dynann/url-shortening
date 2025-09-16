/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import {
  Copy,
  Link,
  ExternalLink,
  Trash2,
  Plus,
  ChartSpline,
} from "lucide-react";
import { ILink } from "@/type";
import { useRouter } from "next/navigation";
// import dotenv from "dotenv"
// dotenv.config()

export default function URLShortener() {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState<ILink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL
  // console.log(API_URL)
  const router = useRouter()
  useEffect(() => {
    async function getUrls() {
      try {
        const response = await fetch(`${API_URL}/links`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          console.error("fail to fetch");
          return;
        }
        const data = await response.json();
        // console.log(data.data.data)
        if (Array.isArray(data.data.data)) {
          setUrls(data.data.data);
        } else {
          setUrls([data.data.data]);
        }
        console.log("==>", urls.length)
      } catch (error) {
        console.log(error);
        setUrls([]);
      }
    }
    getUrls();
  }, []);

  const handleShorten = async () => {
    if (!url.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url }),
      });
      const data = await response.json();
      if(!data.data.data) {
        alert("error link timeout")
        return
      }
      setUrls((prev) => [data.data.data, ...prev]);
      setUrl("");
    } catch (error) {
      console.error("Failed to shorten URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (Id: string) => {
    // console.log("clicked")
    if (!Id.trim()) return;

    try {
      const response = await fetch(`${API_URL}/links/${Id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      window.location.reload();
      if (!response.ok) {
        console.log("fail to delete");
        return;
      }
      // console.log(data.Message)
      alert("delete successfully");
    } catch (err: any) {
      console.error(err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      console.log(urls);
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDynamic = async (id: string) => {
    console.log(id)
    router.push(`statistic/${id}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleShorten();
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full">
              <Link className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            URL Shortener
          </h1>
          <p className="text-gray-600 text-lg">
            Transform long URLs into short, shareable links
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* URL Input Section */}
          <div className="mb-8">
            <label
              htmlFor="url-input"
              className="block text-sm font-semibold text-gray-700 mb-3"
            >
              Enter your URL
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  id="url-input"
                  type="url"
                  value={url}
                  name="url"
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://example.com/your-long-url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-400"
                />
                <Plus className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <button
                onClick={handleShorten}
                disabled={!url.trim() || isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Shortening...
                  </div>
                ) : (
                  "Shorten"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* URL List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Shortened URLs
            </h2>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {urls.length} URLs
            </div>
          </div>

          { urls.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Link className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No URLs shortened yet</p>
              <p className="text-gray-400">Start by entering a URL above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {urls.map((item, index) => (
                <div
                  key={`${item?.id}-${index}`}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          #{index + 1}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item?.clicks} clicks
                        </span>
                      </div>

                      {/* Original URL */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">
                          Original URL:
                        </p>
                        <div className="flex items-center gap-2 group">
                          <p className="text-blue-700 truncate text-sm">
                            {item?.url}
                          </p>
                          <button
                            onClick={() => window.open(item?.url, "_blank")}
                            className=""
                            title="Open in new tab"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                          </button>
                        </div>
                      </div>

                      {/* Short URL */}
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Short URL:</p>
                        <div className="flex items-center gap-2">
                          <p className="text-blue-600 font-medium text-sm">
                            {item?.id}
                          </p>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                `${API_URL}/${item?.id}`
                              )
                            }
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                          </button>
                          <button
                            onClick={() =>
                              window.open(
                                `${process.env.API_URL}/links/redirect/${item?.id}`,
                                "_blank"
                              )
                            }
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Open in new tab"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => handleDynamic(item?.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete URL"
                      >
                        <ChartSpline className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(item?.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete URL"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

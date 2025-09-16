/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Link,
  Calendar,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Copy,
  Activity,
} from "lucide-react";
import { countClicks } from "@/utils/utils";
import { IHourData, ILink } from "@/type";
// import dotenv from "dotenv"
// dotenv.config()

export default function UrlStatisticsPage({ id }: { id: string }) {
  const [link, setLink] = useState<ILink>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hourData, setHourData] = useState<IHourData[]>([])
  const API_URL = process.env.NEXT_PUBLIC_API_URL 
  useEffect(() => {
    async function getUrls() {
      try {
        const response = await fetch(`${API_URL}/links/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          console.error("hello world");
          return;
        }
        const data = await response.json();
        setLink(data.data.data);
        console.log(link);
      } catch {
        alert("fail to fetch");
      }
    }
    async function getClicks() {
      try {
        const response = await fetch(
          `${API_URL}/links/clicks-hour/${id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        if (!data.data.data) {
          alert("error");
          return;
        }
        setHourData(data.data.data)
      } catch (error) {
        console.error("Failed to shorten URL:", error);
      }
    }
    getUrls();
    getClicks()
  }, []);


  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    // In real app, you would fetch new data here based on newDate
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  const maxClicks = Math.max(...hourData.map((d) => d.Click));
  const chartHeight = 200;

  const getBarHeight = (clicks: number): number => {
    if (maxClicks === 0) return 0;
    return (clicks / maxClicks) * chartHeight;
  };

  //   const formatUrl = (url?: string, maxLength: number = 50): string => {
  //     return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  //   };

  const copyToClipboard = async (text: string) => {
    try {
      // console.log(urls);
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Click Statistics
          </h1>
          <p className="text-gray-600">
            Monitor your shortened URL performance
          </p>
        </div>

        {/* URL Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-start gap-3">
              <Link className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-col">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Short URL
                </h3>
                <p className="text-lg font-semibold text-blue-600 break-all">
                  {link?.id}
                </p>
                <button
                  onClick={() => window.open(link!.url, "_blank")}
                  className=""
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                </button>
                <button
                  onClick={() =>
                    copyToClipboard(`${process.env.API_URL}/${link!.id}`)
                  }
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-start gap-3">
              <Link className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Original URL
                </h3>
                <p
                  className="text-sm text-gray-700 break-all"
                  title={link?.url}
                >
                  {link?.url}
                  <button
                    onClick={() => window.open(link!.url, "_blank")}
                    className=""
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {link?.clicks.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Clicks</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                {countClicks(link?.click_records) == 0 ? (
                  <div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {countClicks(link?.click_records)}
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-600">Today&apos;s Clicks</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{maxClicks}</p>
                <p className="text-sm text-gray-600">Peak Hour</p>
              </div>
            </div>
          </div>
        </div>

        {/* Click Record Chart */}
        <div className="bg-white p-8 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Click Record Page
          </h2>

          {/* Chart Container */}
          <div className="relative">
            {/* Chart Area */}
            <div
              className="flex items-end justify-between gap-2 mb-4"
              style={{ height: `${chartHeight + 20}px` }}
            >
              {hourData.map((data, index: number) => {
                const barHeight = getBarHeight(data.Click);
                const isHighlighted =
                  data.Click === maxClicks && data.Click > 0;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 relative"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Click count label */}
                    {data.Click > 0 && (
                      <div className="absolute -top-6 text-xs font-medium text-gray-700">
                        {hoveredIndex === index && data.Click}
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      className={`w-full max-w-12 transition-all duration-300 hover:opacity-80 ${
                        isHighlighted
                          ? "bg-blue-600"
                          : data.Click > 0
                          ? "bg-blue-400"
                          : "bg-gray-200"
                      }`}
                      style={{
                        height: `${Math.max(
                          barHeight,
                          data.Click > 0 ? 8 : 4
                        )}px`,
                        marginBottom: "4px",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-gray-600 border-t pt-2">
              {hourData.map((data, index) => (
                <div key={index} className="flex-1 text-center">
                  {data.Hour}
                </div>
              ))}
            </div>

            {/* Date Navigation */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <button
                  onClick={goToPreviousDay}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Previous day"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-medium min-w-20 text-center">
                  {formatDate(selectedDate)}
                </span>
                <button
                  onClick={goToNextDay}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                  disabled={selectedDate >= new Date()}
                  aria-label="Next day"
                >
                  <ChevronRight
                    className={`h-4 w-4 ${
                      selectedDate >= new Date() ? "text-gray-400" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => countClicks(link?.click_records)}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                  disabled={selectedDate >= new Date()}
                  aria-label="Next day"
                >
                  <Activity
                    className={`h-4 w-4 ${
                      selectedDate >= new Date() ? "text-green-400" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span>Regular Activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span>Peak Activity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Statistics are updated in real-time. Data shows clicks for the last
            24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

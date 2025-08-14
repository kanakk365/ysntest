"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Blog from "@/components/LandingPage/Blog";
import Contact from "@/components/ui/contact";
import { useAuthStore } from "@/lib/auth-store";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { motion } from "motion/react";

type Organization = {
  orgz_name: string;
  orgz_logo?: string | null;
  player_count?: number;
  orgz_slug_name: string;
  [key: string]: unknown;
};

export default function OrgPage() {
  const { user } = useAuthStore();

  const pageSizeOptions = [8, 16, 24, 36];
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [organizationData, setOrganizationData] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchOrganizations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await axios.get<{
          status: boolean;
          data: Organization[];
        }>("https://beta.ysn.tv/api/organizations");
        if (isMounted && data?.status && Array.isArray(data.data)) {
          setOrganizationData(data.data);
        }
      } catch {
        if (isMounted) setError("Failed to load organizations");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchOrganizations();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrganization = useMemo(() => {
    if (!searchQuery) return organizationData;
    const q = searchQuery.toLowerCase();
    return organizationData.filter((org) =>
      Object.values(org).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(q)
      )
    );
  }, [organizationData, searchQuery]);

  const totalItems = filteredOrganization.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const paginationData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredOrganization.slice(start, end);
  }, [filteredOrganization, currentPage, pageSize]);
  const safeData = Array.isArray(paginationData) ? paginationData : [];

  const pageNumbers = () => {
    const siblingCount = 2;
    const start = Math.max(1, currentPage - siblingCount);
    const end = Math.min(totalPages, currentPage + siblingCount);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen  text-white">
      <div className="relative">
        <div className="absolute inset-0  opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative px-4 md:px-8 lg:px-12 pt-32 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-3 group">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full transform group-hover:scale-y-125 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-500" />
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-500">
                    Organizations
                  </h1>
                </div>
                <motion.p
                  className="text-gray-400 text-lg max-w-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                >
                  Discover and connect with organizations in your network
                </motion.p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:gap-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              >
                {user?.user_type === 1 && (
                  <Link href="/dashboard" className="group">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 p-[1px] hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 hover:scale-105">
                      <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-xl text-white font-medium hover:from-purple-500 hover:to-blue-500 transition-all duration-300">
                        <Plus className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        <span>Add Organization</span>
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-white/10 animate-ping" />
                      </div>
                    </div>
                  </Link>
                )}

                <div
                  className={`relative group transition-all duration-500 ${
                    searchFocused ? "scale-105 rotate-1" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/20">
                    <Input
                      placeholder="Search organizations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className="bg-transparent text-white placeholder:text-gray-400 border-0 focus:ring-0 focus-visible:ring-0 h-12 px-6 text-base w-full sm:w-80 transition-all duration-300"
                    />
                    <button
                      type="button"
                      className="flex items-center justify-center w-12 h-12 text-gray-400 hover:text-white hover:bg-purple-600/20 transition-all duration-300 rounded-r-2xl group-hover:scale-110"
                    >
                      <Search className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-4 md:px-8 lg:px-12 pb-16">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin" />
                <motion.div
                  className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-4 w-12 h-12 border-4 border-transparent border-t-purple-400 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                    delay: 0.3,
                  }}
                />
              </div>
              <div className="text-center space-y-2 animate-pulse">
                <h2 className="text-xl font-semibold text-gray-300">
                  Loading organizations...
                </h2>
                <p className="text-gray-500">
                  Please wait while we fetch the latest data
                </p>
              </div>
            </div>
          ) : safeData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
              {safeData.map((orgData, index) => (
                <Link
                  key={index}
                  href={`/organization/${orgData.orgz_slug_name}`}
                  className="group block"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <motion.div
                    style={{
                      background:
                        "radial-gradient(87.91% 87.91% at 65.6% 48.94%, #2C1059 0%, #0D0837 90%)",
                    }}
                    className={`relative h-64 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden transition-all duration-700 hover:border-purple-500/50 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-purple-500/20 ${
                      hoveredCard === index ? "z-10" : ""
                    }`}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: index * 0.15,
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-700/30 transition-opacity duration-700 ${
                        hoveredCard === index ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/30 to-purple-400/20 animate-pulse" />
                    </div>

                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="relative w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl border-2 border-gray-600 shadow-xl group-hover:shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-700 group-hover:scale-125 group-hover:-rotate-6">
                        <div className="absolute inset-1 rounded-xl overflow-hidden">
                          <Image
                            src={
                              orgData.orgz_logo
                                ? String(orgData.orgz_logo).replace(
                                    /^http:\/\//,
                                    "https://"
                                  )
                                : "/ysnlogo.webp"
                            }
                            alt={`${orgData.orgz_name} logo`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>

                    <div className="flex flex-col justify-end h-full p-6 pt-28 text-center">
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-500 transform group-hover:scale-105">
                          {orgData.orgz_name}
                        </h3>

                        <div className="flex items-center justify-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse group-hover:bg-green-400 group-hover:shadow-lg group-hover:shadow-green-400/50" />
                          <span className="text-sm font-medium transform group-hover:scale-105 transition-transform duration-300">
                            {orgData.player_count ?? 0} Players
                          </span>
                        </div>

                        <div className="pt-2">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-purple-500/30 rounded-lg border border-gray-600/50 hover:border-purple-500/50 text-sm font-medium text-gray-300 hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                            <span>View Details</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-32 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center group hover:scale-110 hover:rotate-12 transition-all duration-500">
                <Search className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-300">
                  {error ?? "No Organizations Found"}
                </h2>
                <p className="text-gray-500 max-w-md">
                  {error
                    ? "Something went wrong while loading organizations."
                    : "Try adjusting your search criteria or check back later."}
                </p>
              </div>
            </motion.div>
          )}

          {safeData.length > 0 && (
            <div className="mt-20 flex flex-col lg:flex-row justify-between items-center gap-6 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="flex items-center gap-3 text-sm">
                <label htmlFor="pageSize" className="text-gray-400 font-medium">
                  Rows per page:
                </label>
                <div className="relative group">
                  <select
                    id="pageSize"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="appearance-none bg-gray-700/50 text-white border border-gray-600/50 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-gray-700/70 hover:scale-105"
                  >
                    {pageSizeOptions.map((size) => (
                      <option key={size} value={size} className="bg-gray-800">
                        {size}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-purple-400 transition-colors duration-300" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-125 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-125 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {pageNumbers().map((num) => (
                    <button
                      key={num}
                      onClick={() => handlePageChange(num)}
                      className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-all duration-500 hover:scale-125 ${
                        currentPage === num
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 scale-110"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50 hover:shadow-lg hover:shadow-purple-500/20"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-125 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-125 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Blog />
      <Contact />
    </div>
  );
}

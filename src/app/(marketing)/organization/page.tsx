"use client"

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import Blog from "@/components/LandingPage/Blog"
import Contact from "@/components/ui/contact"
import { useAuthStore } from "@/lib/auth-store"
import { Plus } from "lucide-react"

type Organization = {
  orgz_name: string
  orgz_logo?: string | null
  player_count?: number
  orgz_slug_name: string
  [key: string]: unknown
}

export default function OrgPage() {
  const { user } = useAuthStore()

  const pageSizeOptions = [8, 16, 24, 36]
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0])
  const [searchQuery, setSearchQuery] = useState<string>("")

  const [organizationData, setOrganizationData] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchOrganizations = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const { data } = await axios.get<{ status: boolean; data: Organization[] }>(
          "https://beta.ysn.tv/api/organizations"
        )
        if (isMounted && data?.status && Array.isArray(data.data)) {
          setOrganizationData(data.data)
        }
      } catch {
        if (isMounted) setError("Failed to load organizations")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    fetchOrganizations()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredOrganization = useMemo(() => {
    if (!searchQuery) return organizationData
    const q = searchQuery.toLowerCase()
    return organizationData.filter((org) =>
      Object.values(org).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(q)
      )
    )
  }, [organizationData, searchQuery])

  const totalItems = filteredOrganization.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value))
    setCurrentPage(1)
  }

  const paginationData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filteredOrganization.slice(start, end)
  }, [filteredOrganization, currentPage, pageSize])

  const pageNumbers = () => {
    const siblingCount = 2
    const start = Math.max(1, currentPage - siblingCount)
    const end = Math.min(totalPages, currentPage + siblingCount)
    const pages: number[] = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className="bg-black text-white">
      <div className="relative py-2 md:px-6 mx-[5%] z-10 overflow-hidden">
        <div className="relative flex flex-col md:flex-row items-end gap-3 border-b border-[#1C1A26] md:px-0 pt-[250px] md:pt-[185px]" style={{ justifyContent: "space-between" }}>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl">Organizations</h1>
          </div>
          <div className="border-t border-[#1C1A26]" />
          <div className="flex flex-col md:flex-row items-center justify-center mb-5 w-full md:w-auto">
            {user?.user_type === 1 && (
              <Link href="/dashboard" className="me-4">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium shadow hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Organization
                </span>
              </Link>
            )}
            <div className="flex rounded-full bg-[#0d1829] px-1 w-full max-w-[700px] mt-5 md:mt-0">
              <Input
                placeholder="Search organizations"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0d1829] text-gray-200 border-0 focus:ring-0 focus-visible:ring-0 focus-visible:border-0 rounded-full h-10 px-4"
              />
              <button type="button" className="relative py-2 p-2 bg-[#0d1829] rounded-full">
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black text-white py-12 md:px-6 z-10">
        <div className="container m-auto flex" style={{ justifyContent: "center" }}>
          {isLoading ? (
            <div className="flex mt-[200px] mb-[200px]">
              <h2 className="text-center">Loading organizations...</h2>
            </div>
          ) : paginationData.length > 0 ? (
            <div className="flex flex-wrap justify-center items-center gap-12 2xl:gap-6">
              {paginationData.map((orgData, index) => (
                <Link key={index} href={`/organization/${orgData.orgz_slug_name}`}>
                  <div className="mt-[100px] relative w-[310px] h-[190px] bg-gradient-to-b from-[#0f0b23d1] to-[#2a254596] rounded-2xl text-white flex flex-col items-center justify-end pb-6 shadow-lg">
                    <div className="absolute w-[226px] h-[130px] -top-[65px] overflow-hidden flex items-center justify-center">
                      <Image
                        src={orgData.orgz_logo ? String(orgData.orgz_logo).replace(/^http:\/\//, 'https://') : "/ysnlogo.webp"}
                        alt="Organization logo"
                        width={100}
                        height={120}
                        className="object-contain absolute top-1"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">{orgData.orgz_name}</h3>
                      <p className="text-lg text-gray-300 mb-4">{orgData.player_count ?? 0} Players</p>
                      <div className="flex items-center justify-center gap-2">View</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex mt-[200px] mb-[200px]">
              <h2 className="text-center">{error ?? "No Organization Available"}</h2>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 lg:pl-20 pt-10">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <label htmlFor="pageSize" className="whitespace-nowrap">Rows Per Page:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="bg-black text-gray-400 border border-gray-300 rounded-md px-6 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="px-2 py-1 text-gray-600 transition-all duration-500 ease-in-out hover:bg-gray-100 rounded disabled:text-gray-400">
              «
            </button>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 text-gray-600 transition-all duration-500 ease-in-out hover:bg-gray-100 rounded disabled:text-gray-400">
              ‹
            </button>

            {pageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-500 ease-in-out ${currentPage === num ? "bg-gradient-to-r from-purple-600 to-blue-600" : "hover:bg-gray-200 hover:text-purple-500 text-gray-200"}`}
              >
                {num}
              </button>
            ))}

            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 text-gray-600 transition-all duration-500 ease-in-out hover:bg-gray-100 rounded disabled:text-gray-400">
              ›
            </button>
            <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 text-gray-600 transition-all duration-500 ease-in-out hover:bg-gray-100 rounded disabled:text-gray-400">
              »
            </button>
          </div>
        </div>
      </div>

      <Blog />
      <Contact />
    </div>
  )
}

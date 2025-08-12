"use client"

import React, { useMemo, useState } from "react"

type Subscriber = {
  orgs_id: number
  name: string
  email: string
  user_type?: number | null
  user_mobile?: string | null
}

type Props = {
  data: Subscriber[]
}

function formatUserType(type?: number | null): string {
  if (type === 1) return "Admin"
  if (type === 2) return "Organization"
  if (type === 3) return "Coach"
  if (type === 4) return "Outside Coach"
  if (type === 5) return "Kids"
  if (type === 6) return "Parent"
  if (type === 7) return "College Coach"
  if (type === 8) return "Professional Scout"
  return "-"
}

export default function OrganizationSubscribers({ data }: Props) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((d) => (d.name || "").toLowerCase().includes(q))
  }, [data, query])

  return (
    <div className="container mx-auto px-4 text-white">
      <div className="flex justify-between items-center mt-12 mb-3">
        <div className="flex items-center gap-3">
          <img src="/assets/star.webp" alt="asterisk" className="h-7 w-7 object-contain" />
          <h2 className="text-xl md:text-2xl font-bold">Organization Subscribers</h2>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Subscribers"
          className="w-full md:max-w-[300px] rounded-md bg-[#0f0b23] border border-[#1C1A26] px-3 py-2 text-sm outline-none"
        />
      </div>
      <div className="border-t border-[#1C1A26] mb-4" />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-white/70">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">User Type</th>
              <th className="px-3 py-2">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.orgs_id} className="border-t border-[#1C1A26]">
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2">{row.email}</td>
                <td className="px-3 py-2">{formatUserType(row.user_type)}</td>
                <td className="px-3 py-2">{row.user_mobile || "-"}</td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-white/60">
                  No subscribers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

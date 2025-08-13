import { useAuthStore } from "./auth-store"

const BASE_URL = "https://beta.ysn.tv/api"

export type OrgApiResponse<T = unknown> = {
  status: boolean
  data: T
  message: string
}

async function authorizedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const { user } = useAuthStore.getState()
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  }

  if (!(init.body instanceof FormData)) {
    if (!headers["Content-Type"]) headers["Content-Type"] = "application/json"
  }
  if (user?.token) headers.Authorization = `Bearer ${user.token}`

  return fetch(url, { ...init, headers })
}

export const OrgService = {
  async getDetails(slug: string): Promise<OrgApiResponse<unknown>> {
    const res = await authorizedFetch(`${BASE_URL}/organization-details/${encodeURIComponent(slug)}`, {
      method: "GET",
    })
    return res.json()
  },

  teams: {
    async storeUpdate(formData: FormData): Promise<OrgApiResponse<unknown>> {
      const res = await authorizedFetch(`${BASE_URL}/team/store-update`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to create/update team")
      }
      return res.json()
    },

    async delete(payload: { deletedId: string }): Promise<OrgApiResponse<unknown>> {
      const res = await authorizedFetch(`${BASE_URL}/team/delete`, {
        method: "DELETE",
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to delete team")
      }
      return res.json()
    },
  },
}

export default OrgService



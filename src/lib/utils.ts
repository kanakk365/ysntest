import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Authentication utility functions
export const clearAuthStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear()
    console.log('Utils: All localStorage data cleared')
  }
}

export const debugAuthState = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('ysn-auth-storage')
    const urlParams = new URLSearchParams(window.location.search)
    const status = urlParams.get('status')
    const dataParam = urlParams.get('data')
    
    console.log('Utils: Auth Debug Info:', {
      hasStoredData: !!stored,
      urlStatus: status,
      hasDataParam: !!dataParam,
      pathname: window.location.pathname,
      fullUrl: window.location.href
    })
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        console.log('Utils: Stored auth data:', parsed)
      } catch (e) {
        console.log('Utils: Could not parse stored data')
      }
    }
  }
}

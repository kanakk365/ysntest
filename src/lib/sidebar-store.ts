import { create } from 'zustand'
import React from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

interface SidebarState {
  isOpen: boolean
  isMobile: boolean
  openMobile: boolean
  toggleSidebar: () => void
  setOpen: (open: boolean) => void
  setOpenMobile: (open: boolean) => void
  setIsMobile: (isMobile: boolean) => void
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isOpen: true,
  isMobile: false,
  openMobile: false,

  toggleSidebar: () => {
    const { isMobile, isOpen, openMobile } = get()
    if (isMobile) {
      set({ openMobile: !openMobile })
    } else {
      set({ isOpen: !isOpen })
    }
  },

  setOpen: (open: boolean) => {
    set({ isOpen: open })
  },

  setOpenMobile: (open: boolean) => {
    set({ openMobile: open })
  },

  setIsMobile: (isMobile: boolean) => {
    set({ isMobile })
  },
}))

// Hook to sync mobile state with the store
export const useSidebarMobileSync = () => {
  const isMobile = useIsMobile()
  const { setIsMobile } = useSidebarStore()

  React.useEffect(() => {
    setIsMobile(isMobile)
  }, [isMobile, setIsMobile])
} 
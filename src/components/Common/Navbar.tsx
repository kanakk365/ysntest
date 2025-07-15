"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, Home, Building2, Info, Users, Newspaper } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { NavBar } from './AnimatedNavbar'

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const navigationItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Organizations', url: '/organization', icon: Building2 },
    { name: 'About Us', url: '/about-us', icon: Info },
    { name: 'Sponsors', url: '/sponsor', icon: Users },
    { name: 'News', url: '/news', icon: Newspaper },
  ]

  // Desktop Search Component
  const DesktopSearch = () => (
    <div className="relative w-10 h-10 flex items-center">
      <button 
        className={` cursor-pointer absolute left-3 z-20 transition-opacity duration-300 ${
          isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      >
        <Search className="w-5 h-5 text-gray-500" />
      </button>
      
      {/* Search Input Container - Absolutely positioned to not affect layout */}
      <div className={`absolute right-0 top-0 z-10 transition-all duration-500 ease-in-out ${
        isSearchOpen ? 'w-40 opacity-100' : 'w-0 opacity-0'
      } overflow-hidden`}>
        <div className="relative flex items-center w-40">
          <input
            type="text"
            placeholder="Search..."
            className="bg-black text-white text-sm border border-purple-500 focus:border-purple-500 outline-purple-500 ring-none rounded-full pl-10 pr-10 py-1.5 shadow-md focus:outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            className="absolute right-3 z-10"
            onClick={() => {
              setIsSearchOpen(false)
              setSearchQuery('')
            }}
          >
            <X className="w-5 h-5 text-gray-500 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Search Results Dropdown */}
      <ul className={`bg-gray-900 mt-1 rounded-lg shadow-lg overflow-y-scroll scrollbar-thin scrollbar-thumb-custom scrollbar z-10 absolute w-40 right-0 top-12 transition-all duration-500 ease-in-out ${
        isSearchOpen && searchQuery ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="flex items-center justify-center h-[100px] rounded-2xl">
          <p className="text-sm text-white opacity-50">No Results Found</p>
        </div>
      </ul>
    </div>
  )

  // Desktop Auth Buttons
  const DesktopAuth = () => (
    <div className="flex items-center gap-4">
      <Link
        href="https://beta.ysn.tv/login"
        className="text-white"
      >
        Log In
      </Link>
      <div>
        |
      </div>
      <Link
        href="https://beta.ysn.tv/register"
        className="text-white"
      >
        Sign Up
      </Link>
    </div>
  )

  // Mobile Search Component
  const MobileSearch = () => (
    <div className="flex justify-start items-center w-full mt-4">
      <div className="flex flex-col gap-4 items-start w-full relative">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 z-10 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-black text-white text-sm border border-purple-500 focus:border-purple-500 outline-purple-500 ring-none rounded-full px-10 py-1.5 shadow-md focus:outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 z-10"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-5 h-5 text-gray-500 cursor-pointer" />
            </button>
          )}
        </div>
        {searchQuery && (
          <ul className="bg-gray-900 mt-1 rounded-lg shadow-lg overflow-y-scroll scrollbar-thin scrollbar-thumb-custom scrollbar z-10 absolute w-full top-12">
            <div className="flex items-center justify-center h-[100px] rounded-2xl">
              <p className="text-sm text-white opacity-50">No Results Found</p>
            </div>
          </ul>
        )}
      </div>
    </div>
  )

  // Mobile Auth Buttons
  const MobileAuth = () => (
    <div className="mt-10 flex flex-col gap-4">
      <Link
        href="https://beta.ysn.tv/login"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-purple-500 text-white hover:border-purple-500/50 transition-all duration-300"
      >
        Log In
      </Link>
      <Link
        href="https://beta.ysn.tv/register"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm ring-offset-background focus-visible:outline-none font-bold focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
      >
        Sign Up
      </Link>
    </div>
  )

  // Desktop Navbar Component
  const DesktopNavbar = () => (
    <div className="flex items-center justify-between">
      {/* Logo Section */}
      <div className="flex items-center z-50">
        <Link href="https://beta.ysn.tv/">
          <Image 
            src="/ysnlogo.webp" 
            alt="YSN Logo" 
            width={150} 
            height={72} 
            className="h-[4.5rem] w-full object-contain" 
          />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="w-[40rem] relative flex items-center justify-center ml-10 z-40">
        <div 
          className="absolute  bg-black top-[-7rem] inset-0 h-[15rem] [transform:perspective(500px)_rotateX(-60deg)] rounded-b-[3rem]"
          style={{
            boxShadow: '0px -25px 50px 22px rgba(0, 0, 0, 0.8), 0 0 0 3px rgba(61, 22, 124, 1), 0 10px 15px rgba(55, 5, 220, 0.9)'
          }}
        />
        <div className="relative z-10 -mt-5 ">
          <NavBar items={navigationItems} className="" />
        </div>
      </div>

      {/* Desktop Search and Auth */}
      <div className="flex items-center gap-4 z-50">
        <DesktopSearch />
        <DesktopAuth />
      </div>
    </div>
  )

  // Mobile Navbar Component
  const MobileNavbar = () => (
    <div className="flex items-center justify-between">
      {/* Mobile Logo */}
      <div className="flex items-center z-50">
        <Link href="https://beta.ysn.tv/">
          <Image 
            src="/ysnlogo.webp" 
            alt="YSN Logo" 
            width={150} 
            height={72} 
            className="h-[4.5rem] w-full object-contain" 
          />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center justify-center z-20">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="relative w-10 h-10 flex items-center justify-center focus:outline-none"
        >
          {/* Animated Hamburger/X Icon */}
          <div className="w-6 h-6 relative">
            {/* Top Line */}
            <motion.span
              className="absolute block w-6 h-0.5 bg-white transform origin-center"
              initial={false}
              animate={isMobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            {/* Middle Line */}
            <motion.span
              className="absolute block w-6 h-0.5 bg-white transform origin-center"
              initial={false}
              animate={isMobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            {/* Bottom Line */}
            <motion.span
              className="absolute block w-6 h-0.5 bg-white transform origin-center"
              initial={false}
              animate={isMobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed top-[90px] left-0 right-0 bottom-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <motion.div 
              className="absolute top-0 left-0 w-full min-h-[500px] bg-black text-white p-6 rounded-bl-3xl shadow-lg"
              style={{
                boxShadow: '0px -25px 50px 22px rgba(0, 0, 0, 0.8), 0 0 0 3px rgba(61, 22, 124, 1), 0 10px 15px rgba(55, 5, 220, 0.9)'
              }}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <motion.ul 
                className="space-y-4 flex flex-col gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={item.url}
                      className="px-4 py-2 rounded-lg hover:bg-purple-700/20 transition text-white block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.ul>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <MobileSearch />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <MobileAuth />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <header className="relative w-full bg-gradient-to-b from-black to-transparent text-white py-4 px-6">
      {isMobile ? <MobileNavbar /> : <DesktopNavbar />}
      
      {/* Purple glow effect */}
      <div className="absolute inset-x-0 top-0 z-20 h-full w-full pointer-events-none">
        <Image 
          src="/bg.svg" 
          alt="Background Glow" 
          width={1920} 
          height={400} 
          className="w-full h-full object-cover pointer-events-none select-none"
        />
      </div>
      
      {/* Hexa SVG below Navbar */}
      <div className="w-full flex justify-center items-center mt-[-2rem] relative z-10">
        {!isMobile && (
          <Image src="/lefthexa.svg" alt="Hexa Background" width={352} height={296} className="pointer-events-none select-none -mr-20 " />
        )}
        <Image src="/hexa.svg" alt="Hexa Background" width={352} height={296} className="pointer-events-none select-none" />
        {!isMobile && (
          <Image src="/righthexa.svg" alt="Hexa Background" width={352} height={296} className="pointer-events-none select-none -ml-20 " />
        )}
      </div>
    </header>
  )
}

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  X,
  Home,
  Building2,
  Info,
  Users,
  Newspaper,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NavBar } from "./AnimatedNavbar";
import { useAuthStore } from "@/lib/auth-store";
import { useChatStore } from "@/lib/chat-store";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ChatPanel from "@/components/chat/ChatPanel";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isOpen, openChat, closeChat } = useChatStore();

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const handleSearchClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSearchOpen(false);
      setIsClosing(false);
      setSearchQuery("");
    }, 300);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navigationItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Organizations", url: "/organization", icon: Building2 },
    { name: "About Us", url: "/aboutus", icon: Info },
    { name: "Sponsors", url: "/sponsors", icon: Users },
    { name: "Advertising", url: "/advertise", icon: Newspaper },
  ];

  const DesktopSearch = () => {
    const searchRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          searchRef.current &&
          !searchRef.current.contains(event.target as Node)
        ) {
          handleSearchClose();
        }
      };

      if (isSearchOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    });

    return (
      <div className="relative w-10 h-10 flex items-center" ref={searchRef}>
        <motion.button
          className="cursor-pointer absolute left-3 z-20"
          initial={false}
          animate={
            isSearchOpen && !isClosing
              ? { opacity: 0, scale: 0.75 }
              : { opacity: 1, scale: 1 }
          }
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            delay: !isSearchOpen ? 0.2 : 0,
          }}
          style={{ pointerEvents: isSearchOpen ? "none" : "auto" }}
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="w-5 h-5 text-gray-500" />
        </motion.button>

        <motion.div
          className="absolute right-0 top-0 z-10 overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={
            isSearchOpen && !isClosing
              ? { width: 200, opacity: 1 }
              : { width: 0, opacity: 0 }
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            {isSearchOpen && (
              <motion.div
                className="relative flex items-center w-50"
                initial={{ scale: 0.9, opacity: 0, x: 20 }}
                animate={
                  !isClosing
                    ? { scale: 1, opacity: 1, x: 0 }
                    : { scale: 0.9, opacity: 0, x: 20 }
                }
                exit={{ scale: 0.9, opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-black text-white text-sm border border-purple-500 focus:border-purple-500 outline-purple-500 ring-none rounded-full pl-4 pr-4 py-1.5 shadow-md focus:outline-none w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <motion.button
                  className="absolute right-3 z-10"
                  initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
                  animate={
                    !isClosing
                      ? { opacity: 1, scale: 1, rotate: 0 }
                      : { opacity: 0, scale: 0.5, rotate: 180 }
                  }
                  exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                    delay: !isClosing && isSearchOpen ? 0.1 : 0,
                  }}
                  onClick={handleSearchClose}
                >
                  <X className="w-5 h-5 text-gray-500 cursor-pointer" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {isSearchOpen && searchQuery && (
            <motion.ul
              className="bg-gray-900 mt-1 rounded-lg shadow-lg overflow-y-scroll scrollbar-thin scrollbar-thumb-custom scrollbar z-10 absolute w-40 right-0 top-12"
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-center h-[100px] rounded-2xl">
                <p className="text-sm text-white opacity-50">
                  No Results Found
                </p>
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Message Icon Component
  const MessageIcon = () => {
    const unreadCount = 0; // You can implement unread count logic here
    
    return (
      <Dialog open={isOpen} onOpenChange={(open) => (open ? openChat() : closeChat())}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="relative cursor-pointer text-white hover:text-purple-400 h-10 w-10">
            <MessageCircle className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw] max-w-none sm:max-w-none h-[90vh] p-0 flex flex-col">
          <DialogHeader className="border-b px-4 py-3 flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="size-5" />
              Messages
              {unreadCount > 0 && (
                <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden min-h-0">
            <ChatPanel hideHeader />
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Desktop Auth Buttons
  const DesktopAuth = () => (
    <div className="flex items-center gap-4">
      <Link href="/login" className="text-white">
        Log In
      </Link>
      <div>|</div>
      <Link href="/login" className="text-white">
        Sign Up
      </Link>
    </div>
  );

  const DesktopUserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full border border-purple-500/40 p-1 focus:outline-none">
          <Avatar className="size-8">
            <AvatarFallback>
              {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuLabel className="text-xs opacity-70">
          {user?.name || user?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut className="w-4 h-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
              className="absolute right-3 z-10 cursor-pointer"
              onClick={() => setSearchQuery("")}
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
  );

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
  );

  const MobileMessage = () => (
    <div className="mt-6">
      <Dialog open={isOpen} onOpenChange={(open) => (open ? openChat() : closeChat())}>
        <DialogTrigger asChild>
          <button 
            className="flex items-center gap-3 rounded-full border border-purple-500/40 p-3 focus:outline-none w-full hover:bg-purple-700/20 transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <MessageCircle className="size-5 text-white" />
            <span className="text-white text-sm">Messages</span>
          </button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-none h-[90vh] p-0 flex flex-col">
          <DialogHeader className="border-b px-4 py-3 flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="size-5" />
              Messages
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden min-h-0">
            <ChatPanel hideHeader />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const MobileUserMenu = () => (
    <div className="mt-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-full border border-purple-500/40 p-1 focus:outline-none">
            <Avatar className="size-9">
              <AvatarFallback>
                {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-white text-sm">Account</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[12rem]">
          <DropdownMenuLabel className="text-xs opacity-70">
            {user?.name || user?.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

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
          className="absolute bg-black top-[-7.5rem] inset-0 h-[15rem] [transform:perspective(660px)_rotateX(-60deg)] rounded-b-[2rem]"
          style={{
            boxShadow:
              "0px -25px 50px 22px rgba(0, 0, 0, 0.8), 0 0 0 3px rgba(61, 22, 124, 1), 0 10px 15px rgba(55, 5, 220, 0.9)",
          }}
        />
        <div className="relative z-10 -mt-5 ">
          <NavBar items={navigationItems} className="" />
        </div>
      </div>

      {/* Desktop Search and Auth */}
      <div className="flex items-center gap-4 z-50">
        <DesktopSearch />
        {isAuthenticated && <MessageIcon />}
        {isAuthenticated ? <DesktopUserMenu /> : <DesktopAuth />}
      </div>
    </div>
  );

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
          className="relative w-10 h-10 flex items-center justify-center focus:outline-none cursor-pointer"
        >
          {/* Animated Hamburger/X Icon */}
          <div className="w-6 h-6 relative">
            {/* Top Line */}
            <motion.span
              className="absolute block w-6 h-0.5 bg-white transform origin-center"
              initial={false}
              animate={
                isMobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }
              }
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            {/* Middle Line */}
            <motion.span
              className="absolute block w-6 h-0.5 bg-white transform origin-center"
              initial={false}
              animate={
                isMobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }
              }
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            {/* Bottom Line */}
            <motion.span
              className="absolute block w-6 h-0.5 bg-white transform origin-center"
              initial={false}
              animate={
                isMobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }
              }
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
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <motion.div
              className="absolute top-0 left-0 w-full min-h-[500px] bg-black text-white p-6 rounded-bl-3xl shadow-lg"
              style={{
                boxShadow:
                  "0px -25px 50px 22px rgba(0, 0, 0, 0.8), 0 0 0 3px rgba(61, 22, 124, 1), 0 10px 15px rgba(55, 5, 220, 0.9)",
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
                {isAuthenticated ? (
                  <>
                    <MobileMessage />
                    <MobileUserMenu />
                  </>
                ) : (
                  <MobileAuth />
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

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
    </header>
  );
}

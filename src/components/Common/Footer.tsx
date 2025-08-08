
"use client"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useState } from "react"
import { toast } from "sonner"

export default function Footer() {
  const { theme } = useTheme()
  const [email, setEmail] = useState("")
  const isLightTheme = theme === "light"

  const handleClickSubscribe = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      toast.error("Please enter your email address first to subscribe");
    } else if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
    } else {
      toast.success("Subscription successful. You'll hear from us soon!");
      setEmail("")
    }
  };

  return (
    <footer className={`${isLightTheme ? "bg-gray-100 text-gray-700" : "bg-black text-gray-300"}`}>
      <div className="container md:px-[5%] py-12 md:py-16 m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${isLightTheme ? "text-gray-900" : "text-white"}`}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">YSN</span>
            </h3>
            <p className={isLightTheme ? "text-gray-600" : "text-gray-400"}>
              The premier youth sports and events complex in Kings Park, Long Island. Opening January 2026.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className={`${isLightTheme ? "text-gray-500" : "text-gray-400"} transition-colors hover:text-[#1877F2]`}
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className={`${isLightTheme ? "text-gray-500" : "text-gray-400"} transition-colors hover:text-[#1DA1F2]`}
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className={`${isLightTheme ? "text-gray-500" : "text-gray-400"} transition-colors hover:text-[#E4405F]`}
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className={`${isLightTheme ? "text-gray-500" : "text-gray-400"} transition-colors hover:text-[#FF0000]`}
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className={`text-xl font-semibold ${isLightTheme ? "text-gray-900" : "text-white"} mb-4`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className={`text-base ${isLightTheme ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  Home 
                </Link>
              </li>
              <li>
                <Link
                  href="about-us"
                  className={`text-base ${isLightTheme ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="news"
                  className={`text-base ${isLightTheme ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  Advertising
                </Link>
              </li>
              <li>
                <Link
                  href="sponsor"
                  className={`text-base ${isLightTheme ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  Sponsors
                </Link>
              </li>
              <li>
                <Link
                  href="organization"
                  className={`text-base ${isLightTheme ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  Organizations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`text-xl font-semibold ${isLightTheme ? "text-gray-900" : "text-white"} mb-4`}>Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="coming-soon"
                  className={`text-base ${isLightTheme ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#contact" 
                  className={`text-base ${isLightTheme ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="coming-soon"
                  className={`text-base ${isLightTheme ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  Help
                </Link>
              </li>
              <li>
                <Link
                  href="coming-soon"
                  className={`text-base ${isLightTheme ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"} transition-colors`}
                >
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`text-xl font-semibold ${isLightTheme ? "text-gray-900" : "text-white"} mb-4`}>
              Stay Updated
            </h3>
            <p className={`${isLightTheme ? "text-gray-600" : "text-gray-400"} mb-4`}>
              Subscribe to our newsletter for the latest updates on YSN.
            </p>
            <form className="space-y-2">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className={`${
                    isLightTheme ? "bg-white border-gray-300 text-gray-800" : "bg-gray-800 border-gray-700 text-white"
                  } rounded-r-none focus-visible:ring-blue-500 py-0`}
                />
                <Button type="button" className="rounded-l-none bg-gradient-to-r from-purple-600 to-blue-600" onClick={handleClickSubscribe}>
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </div>
              <p className="text-xs text-gray-500">We respect your privacy. Unsubscribe at any time.</p>
            </form>
          </div>
        </div>

        <div
          className={`border-t ${isLightTheme ? "border-gray-200" : "border-gray-800"} mt-12 pt-8 flex flex-col md:flex-row justify-between items-center`}
        >
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} YouthSportsLife, crafted with love by YouthSportsLife.
          </p>
        </div>
      </div>
    </footer>
  )
}
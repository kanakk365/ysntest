"use client";

import Navbar from "@/components/Common/Navbar";
import { HeroContainer } from "@/components/LandingPage/hero";
import Image from "next/image";
import About from "@/components/LandingPage/About";
import Streaming from "@/components/LandingPage/Streaming";
import Schedule from "@/components/LandingPage/Schedule";
import Shop from "@/components/LandingPage/Shop";
import Blog from "@/components/LandingPage/Blog";
import Contact from "@/components/LandingPage/Contact";
import Footer from "@/components/Common/Footer";

export function LandingPage() {
  return (
    <div className=" bg-black min-h-screen  flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 ">
        <HeroContainer
          titleComponent={
            <div className=" backdrop-blur-sm py-0 md:py-6 md:px-4 md:pb-5 rounded-xl">
              <h1 className="font-semibold text-white">
                <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent pr-3 text-2xl md:text-4xl">
                  Never miss a game again!
                </span>
                <br />
                <span className="text-4xl md:text-[4rem] font-bold mt-1 leading-none bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Live streamed youth sports
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-6 ">
                The one place to be to catch all the action live, track stats,
                create highlights and much more!
              </p>
            </div>
          }
        >
          <div className="relative h-full w-full">
            <Image
              src="/landing/banner.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        </HeroContainer>

        {/* About / Technology Section */}
        <div className="mt-20 w-full">
          <About />
        </div>

        {/* Streaming Section */}
        <div className="mt-16 w-full">
          <Streaming />
        </div>

        {/* Schedule Section */}
        <div className="mt-20 w-full">
          <Schedule />
        </div>

        {/* Shop Section */}
        <div className="mt-20 w-full">
          <Shop />
        </div>

        {/* Blog Section */}
        <div className="mt-20 w-full">
          <Blog />
        </div>

        {/* Contact Section */}
        <div className="mt-20 w-full">
          <Contact />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

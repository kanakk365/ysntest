import Image from "next/image"
import Link from "next/link"
import Blog from "@/components/LandingPage/Blog"
import Contact from "@/components/ui/contact"
import { ArrowRight, Megaphone, ShoppingBag, IdCard, Video, MessageSquare, Mic2 } from "lucide-react"
import type { ReactNode } from "react"

type FeatureItemProps = {
  icon: ReactNode
  text: string
}

function FeatureItem({ icon, text }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mt-1">{icon}</div>
      <p className="text-sm md:text-base text-white/80">{text}</p>
    </div>
  )
}

export default function AboutUsPage() {
  return (
    <div className="relative w-full overflow-hidden font-sans bg-black text-white">
      {/* Purple honeycomb background (decorative placeholder) */}
      <div className="absolute top-[50px] left-1/2 -translate-x-1/2 flex items-center justify-center w-max" />

      {/* Top banner heading */}
      <section className="relative z-10 overflow-hidden pt-[80px] md:px-[10%]">
        <div className="relative w-full h-[320px] md:h-[420px] lg:h-[520px]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 flex justify-center items-center h-[320px] md:h-[420px] lg:h-[520px] w-full z-10">
          <h1
            className="pr-6 font-extrabold italic uppercase leading-none text-center text-transparent bg-clip-text bg-gradient-to-b from-[#1a0d44] to-black/10 tracking-tight text-[72px] md:text-[160px] lg:text-[200px] -translate-y-16 md:-translate-y-24 lg:-translate-y-28"
          >
            ABOUT US
          </h1>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative z-20 container mx-auto px-6 py-12 md:py-16 text-center -mt-[240px] md:-mt-[340px] lg:-mt-[420px]">
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-[16px] font-bold h-[50px] px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 mb-5">
          Our Mission & Vision
        </button>
        <p className="leading-relaxed text-white/70 text-[16px] max-w-3xl mx-auto">
          YSN provides a cost‑effective, revenue‑generating solution for youth sports organizations to stream live practices and games, view historic video, and connect with your audience through real‑time game chat, remote broadcasting, a connected team store, and mobile solutions.
        </p>
        <p className="mt-6 text-white/60">YSN is part of the Sports vertical solutions from HubT.</p>
        <h3 className="text-sm mt-10 tracking-widest font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#7940D7] to-[#2D09A3]">
          FEATURES
        </h3>
      </section>

      {/* Divider (image style similar to reference) */}
      <div className="relative z-10 flex justify-center mt-2 mb-6">
        <Image
          src="/landing/about/line.webp"
          alt="ABOUT US divider"
          width={1600}
          height={120}
          className="object-contain w-full h-[120px] md:h-[180px] lg:h-[100px]"
        />
      </div>

      {/* Promise */}
      <section className="relative mx-auto max-w-4xl px-6 py-12 text-center md:py-16">
        <p className="text-2xl font-semibold leading-relaxed text-white md:text-[28px]">
          Enjoy a free, premium, and immersive experience for
          <br />
          live-streamed events
        </p>
      </section>

      {/* Features Grid */}
      <section aria-labelledby="features" className="relative px-6 pb-10 md:pb-16">
        <h3 id="features" className="sr-only">
          Platform Features
        </h3>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 text-white/85 md:grid-cols-2 lg:gap-10">
          {/* Left column */}
          <FeatureItem
            icon={<Megaphone className="h-6 w-6 text-purple-300" aria-hidden="true" />}
            text="Add local and organization advertiser content to your organization and team pages for additional revenue."
          />
          <FeatureItem
            icon={<ShoppingBag className="h-6 w-6 text-purple-300" aria-hidden="true" />}
            text="Showcase your merchandise during live streams to drive sales—or get started with help from YSN’s vendor partners."
          />
          <FeatureItem
            icon={<IdCard className="h-6 w-6 text-purple-300" aria-hidden="true" />}
            text="Create player profiles to boost recruitment. Scouts and coaches can view Game Reels and access profiles directly during live games."
          />

          {/* Right column */}
          <FeatureItem
            icon={<Video className="h-6 w-6 text-purple-300" aria-hidden="true" />}
            text="Live stream home and away games to reach fans wherever they are."
          />
          <FeatureItem
            icon={<MessageSquare className="h-6 w-6 text-purple-300" aria-hidden="true" />}
            text="Enable live chat for a more engaging, community-driven experience."
          />
          <FeatureItem
            icon={<Mic2 className="h-6 w-6 text-purple-300" aria-hidden="true" />}
            text="Add excitement with YSN broadcasters calling your game."
          />
        </div>
      </section>

      {/* How it works + CTA */}
      <section className="relative w-full">
        <div className="relative h-[520px] md:h-[1020px]">
          <Image
            src="/landing/about/aboutbg.webp"
            alt="YSN platform"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 " />

          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
            <h3 className="text-[26px] md:text-[32px] font-semibold">
              How it works once approved and connected to the YSN platform
            </h3>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
              <div className="text-left bg-white/5 rounded-xl p-5 border border-white/10">
                <h4 className="font-semibold text-white text-xl">Understanding</h4>
                <p className="text-white/70 mt-2">Connect your existing camera to the YSN platform.</p>
              </div>
              <div className="text-left bg-white/5 rounded-xl p-5 border border-white/10">
                <h4 className="font-semibold text-white text-xl">Service</h4>
                <p className="text-white/70 mt-2">YSN premium service for organizations with facilities. We provide camera(s) depending on size and variables—free of charge.</p>
              </div>
              <div className="text-left bg-white/5 rounded-xl p-5 border border-white/10">
                <h4 className="font-semibold text-white text-xl">Solution</h4>
                <p className="text-white/70 mt-2">We also have a free mobile solution so you don’t miss away games.</p>
              </div>
            </div>

            <Link
              href="#contact"
              className="flex items-center justify-center whitespace-nowrap rounded-full text-[16px] font-bold h-[50px] px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 mt-10"
            >
              Get Connected to YSN <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Content sections from marketing */}
      <div className="mt-20">
        <Blog />
      </div>
      <Contact />
    </div>
  )
}

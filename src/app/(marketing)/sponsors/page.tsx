import Image from "next/image"
import Link from "next/link"
import Blog from "@/components/LandingPage/Blog"
import Contact from "@/components/LandingPage/Contact"
import { ArrowRight } from "lucide-react"

type Sponsor = {
  logo: string
  name: string
  title: string
  classname: string
  badge: string
  link: string
  description: string
  isHeadSponsor?: boolean
}

export default function SponsorsPage() {
  const sponsors: Sponsor[] = [
    {
      logo: "/landing/sponsors/battlelounge.webp",
      name: "Battle Lounge",
      title: "Head Sponsor",
      badge: "Head Sponsor",
      link: "https://battlelounge.gg",
      description:
        "Battle Lounge is an eSport platform where anyone can sign up to play in video game tournaments and compete for Daily, Weekly and Monthly Prizes! Battle Lounge was born, out of the desire to have an outlet to compete in our favorite games and have an opportunity to relish in the glory of winning and earning prizes.",
      isHeadSponsor: true,
      classname: "w-[90%] xl:w-[80%]",
    },
    {
      logo: "/landing/sponsors/nike.webp",
      classname: "w-[50%] xl:w-[30%]",
      name: "Nike",
      title: "Sponsor",
      badge: "Sponsor",
      link: "https://www.nike.com",
      description:
        "Our mission is what drives us to do everything possible to expand human potential. We do that by creating groundbreaking sport innovations, by making our products more sustainably, by building a creative and diverse global team and by making a positive impact in communities where we live and work.",
    },
    {
      logo: "/landing/sponsors/gatorade.webp",
      name: "Gatorade",
      classname: "w-[80%] md:w-[50%]",
      title: "Sponsor",
      badge: "Sponsor",
      link: "https://www.gatorade.com",
      description:
        "The most researched sports beverage on earth Gatorade continues to search and study new ways to help athletes improve performance by delivering proper hydration and nutrition.",
    },
  ]

  return (
    <div className="bg-black text-white">
      {/* Top banner heading */}
      <section className="relative overflow-hidden pt-[70px]">
        <div className="relative w-full h-[300px] md:h-[300px] lg:h-[300px]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 flex justify-center items-center h-[400px] md:h-[500px] lg:h-[600px] w-full md:px-[10%] z-10">
          <h1
            className="pr-6 font-extrabold italic uppercase leading-none text-center text-transparent bg-clip-text bg-gradient-to-b from-[#1a0d44] to-black/10 tracking-tight text-[72px] md:text-[180px] lg:text-[240px] -translate-y-24 md:-translate-y-36 lg:-translate-y-36"
          >
            SPONSORS
          </h1>
        </div>

        {/* Sponsors content */}
        <div className="relative -mt-[40px] md:-mt-[60px] flex flex-col gap-[50px] pb-[100px] md:px-[10%] z-20">
          {sponsors.map((sponsor) => (
            <div key={sponsor.name} className="flex flex-col md:flex-row gap-[50px]">
              <div className="flex-[35%] flex items-center justify-start">
                <div className={`relative ${sponsor.classname}`}>
                  <Image
                    src={sponsor.logo}
                    alt={`${sponsor.name}-logo`}
                    width={520}
                    height={220}
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-5 flex-[65%]">
                <span className="inline-flex items-center justify-center whitespace-nowrap w-[150px] rounded-full h-[48px] text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20">
                  {sponsor.title}
                </span>
                <p className="text-white text-[16px] leading-[23px] opacity-80">{sponsor.description}</p>
                {sponsor.link && (
                  <a
                    href={sponsor.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#7940D7] text-[16px] flex items-center gap-1 hover:underline"
                  >
                    Visit Website
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative w-full">
        <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
          <Image
            src="/landing/sponsors/sponsor-match-bg.webp"
            alt="Sponsor the future"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-6">
            <div className="flex flex-col gap-2 items-center justify-center w-full">
              <h2 className="font-bold text-[22px] md:text-[32px] lg:text-[40px]">Sponsor the Future of Sports</h2>
              <p className="text-[16px] md:text-[18px] lg:text-[20px] text-white/80 max-w-3xl">
                Want your brand seen by families watching youth & pro sports worldwide?
              </p>
            </div>
            <div className="bg-[linear-gradient(354.43deg,_#7940D7_63.8%,_rgba(0,0,0,0.7)_100%)] rounded-full md:px-[1px]">
              <Link
                href="#contact"
                className="flex items-center gap-2 justify-center whitespace-nowrap rounded-full h-[50px] w-[220px] md:w-[400px] text-[16px] md:text-[23px] font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
              >
                Become a Sponsor
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-20">
        <Blog />
      </div>
      <Contact />
    </div>
  )
}




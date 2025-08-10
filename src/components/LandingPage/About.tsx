"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { Gamepad2, Radio, Smartphone, Video, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function About() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  const websiteUrls = [
    "https://battlelounge.io/",
    "https://ysn.tv/",
    "https://www.playerhub.io/",
    "https://www.playerhub.io/",
    "https://www.playerhub.io/",
  ];

  const customGradients = [
    "from-[#b55fc2] to-[#7b53c6]",
    "from-[#0037c0] to-[#4755bb]",
    "from-[#48c4bc] to-[#4755bb]",
    "from-[#7b53c6] to-[#0037c0]",
    "from-[#b55fc2] to-[#48c4bc]",
  ];

  const technologyItems = [
    {
      title: "Live Stream",
      description:
        "Battle Lounge is a hybrid esports tournament platform that merges in-person and online gameplay, allowing youth athletes and gamers to compete in popular video games at our facility's dedicated mini esports arena or remotely through our digital infrastructure.",
      icon: <Gamepad2 className="w-6 h-6" />,
      color: customGradients[0],
      points: [
        {
          title: "In-Person & Online Tournaments",
          description:
            "Host and participate in real-time esports events from anywhere. Our platform seamlessly connects players whether they're competing from our facility or remotely.",
          image: "/landing/battle-lounge-homepage.webp",
        },
        {
          title: "Tournament Management System",
          description:
            "Complete tournament lifecycle management with registration, brackets, player tracking, and real-time updates.",
          image: "/landing/battle-lounge-tournament.webp",
        },
        {
          title: "Personal Gaming Dashboard",
          description:
            "Track your tournament history, upcoming events, and gaming achievements with comprehensive profiles and analytics.",
          image: "/landing/battle-lounge-dashboard.webp",
        },
      ],
    },
    {
      title: "Team Chat",
      description:
        "YSN is a live-streaming and media platform that captures every game, event, and showcase using high-definition cameras across all indoor and outdoor fields.",
      icon: <Radio className="w-6 h-6" />,
      color: customGradients[1],
      points: [
        {
          title: "Professional Live Streaming",
          description:
            "Broadcast high-quality live streams of matches and events with professional presentation and seamless viewing.",
          image: "/landing/ysn-main-stream.webp",
        },
        {
          title: "Interactive Viewing Experience",
          description:
            "Engage with live chat, view multiple camera angles, and access upcoming match schedules.",
          image: "/landing/ysn-live-interface.webp",
        },
        {
          title: "Team Management Platform",
          description:
            "Comprehensive team administration with player rosters, match history, statistics tracking, and tools for coaches.",
          image: "/landing/ysn-team-dashboard.webp",
        },
      ],
    },
    {
      title: "eCommerce",
      description:
        "PlayerHub is the centralized digital profile for every athlete in our ecosystem, enabling athletes to manage schedules, track stats, register for events, and build recruitment-ready profiles.",
      icon: <Users className="w-6 h-6" />,
      color: customGradients[4],
      points: [
        {
          title: "Athlete Profiles & Stats",
          description:
            "Track performance, growth, and milestones across seasons with rich visualizations.",
          image: "/landing/playhub-profile-and-status-2.webp",
        },
        {
          title: "Event & Tournament Management",
          description:
            "Register, schedule, and stay updated on upcoming events and showcases.",
          image: "/landing/playhub-2.webp",
        },
        {
          title: "Recruitment & Gear Hub",
          description:
            "Showcase highlights, connect with scouts, and purchase sport-specific gear.",
          image: "/landing/playerhub-analytics.webp",
        },
      ],
    },
    {
      title: "Rosters",
      description:
        "Professional video production service creating highlight reels and promotional content for athletes.",
      icon: <Video className="w-6 h-6" />,
      color: customGradients[3],
      points: [
        {
          title: "Recruitment Videos",
          description:
            "Professional recruitment videos designed to showcase athlete skills for scouts.",
          image: "/landing/myreels-football.webp",
        },
        {
          title: "Social Media Content",
          description:
            "Optimized content for social media platforms to build athlete personal brands.",
          image: "/landing/playhub-2.webp",
        },
        {
          title: "Game Highlights",
          description:
            "Cinematic game highlight compilations with polished editing and music.",
          image: "/landing/player-dashboard.webp",
        },
      ],
    },
    {
      title: "Connected Athlete",
      description:
        "Connected Athlete is an AI-powered performance and health analytics platform that uses computer vision to analyze movements, identify injury risks, and generate actionable reports.",
      icon: <Smartphone className="w-6 h-6" />,
      color: customGradients[2],
      points: [
        {
          title: "AI Movement Analysis",
          description:
            "Breaks down form and technique using video data and pro benchmarks.",
          image: "/landing/connected-athlete.webp",
        },
        {
          title: "Injury Risk Detection",
          description:
            "Flags potential issues before they become injuries via movement pattern analysis.",
          image: "/landing/connected-athlete-dashboard.webp",
        },
        {
          title: "Integrated Recovery Loop",
          description:
            "Syncs with therapists and health systems to deliver personalized improvement plans.",
          image: "/landing/connected-athlete-profile.webp",
        },
      ],
    },
  ];

  const getCurrentImage = () => {
    if (hoveredPoint !== null) {
      return technologyItems[activeTab].points[hoveredPoint].image;
    }
    return technologyItems[activeTab].points[0].image;
  };

  const getCurrentPointInfo = () => {
    if (hoveredPoint !== null) {
      return technologyItems[activeTab].points[hoveredPoint];
    }
    return technologyItems[activeTab].points[0];
  };

  return (
    <section
      id="sports-technology"
      className=" bg-black py-16 md:py-10  text-foreground"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-4xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#b55fc2] to-[#0037c0]">
              Leading Global Youth Sports Technology at YSN
            </span>
          </h2>
          <p
            className={cn(
              "text-lg md:text-lg max-w-3xl mx-auto",
              isLightTheme ? "text-gray-600" : "text-gray-300"
            )}
          >
            Cutting-edge digital platforms designed to enhance the youth sports
            experience, provide exposure, and develop athletes.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8"
        >
          {technologyItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(index);
                setHoveredPoint(null);
              }}
              className={cn(
                "flex items-center gap-3 px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all duration-300 border",
                "focus:outline-none focus:ring-0 active:scale-95",
                activeTab === index
                  ? `bg-gradient-to-r ${item.color} text-white border-transparent shadow-md`
                  : isLightTheme
                  ? "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  : "bg-gray-900/40 text-gray-300 border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
              )}
            >
              <div
                className={cn(
                  "transition-colors duration-300",
                  activeTab === index
                    ? "text-white"
                    : isLightTheme
                    ? "text-gray-600"
                    : "text-gray-400"
                )}
              >
                {item.icon}
              </div>
              <span className="text-sm md:text-base">{item.title}</span>
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-stretch">
          {/* Left: Points */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-4"
            >
              <h3
                className={cn(
                  "text-2xl font-bold mb-2",
                  isLightTheme ? "text-gray-900" : "text-white"
                )}
              >
                <a
                  href={websiteUrls[activeTab]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {technologyItems[activeTab].title}
                </a>
              </h3>
              <p
                className={cn(
                  "text-base md:text-lg",
                  isLightTheme ? "text-gray-600" : "text-gray-300"
                )}
              >
                {technologyItems[activeTab].description}
              </p>
            </motion.div>

            <div className="space-y-3">
              {technologyItems[activeTab].points.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className={cn(
                    "p-4 rounded-xl cursor-pointer transition-all duration-300 border",
                    isLightTheme
                      ? "bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      : "bg-gray-900/30 border-gray-800 hover:border-gray-700 hover:bg-gray-800/50"
                  )}
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <h4
                    className={cn(
                      "font-semibold mb-2",
                      isLightTheme ? "text-gray-900" : "text-white"
                    )}
                  >
                    <a
                      href={websiteUrls[activeTab]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {point.title}
                    </a>
                  </h4>
                  <p
                    className={cn(
                      "text-sm",
                      isLightTheme ? "text-gray-600" : "text-gray-300"
                    )}
                  >
                    {point.description}
                  </p>
                  {hoveredPoint === index && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.4 }}
                      className={cn(
                        "h-1 mt-3 rounded-full bg-gradient-to-r",
                        technologyItems[activeTab].color
                      )}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative h-[360px] sm:h-[420px] md:h-[520px] lg:h-[600px] w-full">
            <motion.div
              key={`${activeTab}-${hoveredPoint}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-border"
            >
              <div className="relative h-full w-full">
                <Image
                  src={getCurrentImage() || "/landing/banner.webp"}
                  alt={getCurrentPointInfo().title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority={activeTab === 0}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import {
  Gamepad2,
  Radio,
  Smartphone,
  Video,
  Users,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function About() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const websiteUrls = [
    "https://battlelounge.io/",
    "https://ysn.tv/",
    "https://www.playerhub.io/",
    "https://www.playerhub.io/",
    "https://www.playerhub.io/",
  ];

  const customGradients = [
    "from-purple-500 to-indigo-600",
    "from-blue-600 to-indigo-600",
    "from-teal-500 to-blue-600",
    "from-indigo-600 to-blue-700",
    "from-purple-500 to-teal-500",
  ];

  const technologyItems = [
    {
      title: "Battle Lounge",
      subtitle: "Esports Tournament Platform",
      description:
        "A hybrid esports tournament platform that merges in-person and online gameplay, allowing youth athletes and gamers to compete in popular video games at our facility's dedicated mini esports arena or remotely through our digital infrastructure.",
      icon: <Gamepad2 className="w-5 h-5" />,
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
      title: "YSN TV",
      subtitle: "Live Streaming Platform",
      description:
        "A live-streaming and media platform that captures every game, event, and showcase using high-definition cameras across all indoor and outdoor fields.",
      icon: <Radio className="w-5 h-5" />,
      color: customGradients[1],
      points: [
        {
          title: "Professional Live Streaming",
          description:
            "Broadcast high-quality live streams of matches and events with professional presentation and seamless viewing experience.",
          image: "/landing/ysn-main-stream.webp",
        },
        {
          title: "Interactive Viewing Experience",
          description:
            "Engage with live chat, view multiple camera angles, and access upcoming match schedules in real-time.",
          image: "/landing/ysn-live-interface.webp",
        },
        {
          title: "Team Management Platform",
          description:
            "Comprehensive team administration with player rosters, match history, statistics tracking, and coaching tools.",
          image: "/landing/ysn-team-dashboard.webp",
        },
      ],
    },
    {
      title: "PlayerHub",
      subtitle: "Athlete Digital Profiles",
      description:
        "The centralized digital profile for every athlete in our ecosystem, enabling athletes to manage schedules, track stats, register for events, and build recruitment-ready profiles.",
      icon: <Users className="w-5 h-5" />,
      color: customGradients[4],
      points: [
        {
          title: "Athlete Profiles & Statistics",
          description:
            "Track performance, growth, and milestones across seasons with rich data visualizations and comprehensive analytics.",
          image: "/landing/playhub-profile-and-status-2.webp",
        },
        {
          title: "Event & Tournament Management",
          description:
            "Register for events, manage schedules, and stay updated on upcoming tournaments and showcases.",
          image: "/landing/playhub-2.webp",
        },
        {
          title: "Recruitment & Gear Hub",
          description:
            "Showcase highlight reels, connect with college scouts, and purchase sport-specific equipment and gear.",
          image: "/landing/playerhub-analytics.webp",
        },
      ],
    },
    {
      title: "MyReels",
      subtitle: "Video Production Service",
      description:
        "Professional video production service creating highlight reels and promotional content for athletes to showcase their skills and build their personal brand.",
      icon: <Video className="w-5 h-5" />,
      color: customGradients[3],
      points: [
        {
          title: "Recruitment Videos",
          description:
            "Professional recruitment videos designed to showcase athlete skills and achievements for college scouts and recruiters.",
          image: "/landing/myreels-football.webp",
        },
        {
          title: "Social Media Content",
          description:
            "Optimized content for social media platforms to help athletes build their personal brand and online presence.",
          image: "/landing/playhub-2.webp",
        },
        {
          title: "Game Highlights",
          description:
            "Cinematic game highlight compilations with professional editing, music, and visual effects.",
          image: "/landing/player-dashboard.webp",
        },
      ],
    },
    {
      title: "Connected Athlete",
      subtitle: "AI Performance Analytics",
      description:
        "An AI-powered performance and health analytics platform that uses computer vision to analyze movements, identify injury risks, and generate actionable performance reports.",
      icon: <Smartphone className="w-5 h-5" />,
      color: customGradients[2],
      points: [
        {
          title: "AI Movement Analysis",
          description:
            "Advanced computer vision breaks down form and technique using video data compared against professional benchmarks.",
          image: "/landing/connected-athlete.webp",
        },
        {
          title: "Injury Risk Detection",
          description:
            "Proactively identifies potential injury risks before they become problems through movement pattern analysis.",
          image: "/landing/connected-athlete-dashboard.webp",
        },
        {
          title: "Integrated Recovery System",
          description:
            "Syncs with therapists and health systems to deliver personalized improvement and recovery plans.",
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
      className="relative bg-black py-20 md:py-24 text-foreground overflow-hidden"
      ref={sectionRef}
    >
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-black/[0.02]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Sports Technology Platform
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600">
              Leading Global Youth
            </span>
            <br />
            <span className="text-foreground">Sports Technology</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Cutting-edge digital platforms designed to enhance the youth sports
            experience, provide unprecedented exposure opportunities, and
            develop the next generation of athletes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 md:mb-16"
        >
          {technologyItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(index);
                setHoveredPoint(null);
              }}
              className={cn(
                "group flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold transition-all duration-300 border-2",
                "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-background",
                "active:scale-95 hover:scale-105",
                activeTab === index
                  ? `bg-gradient-to-r ${item.color} text-white border-transparent shadow-lg shadow-purple-500/25`
                  : "bg-card/50 backdrop-blur-sm text-foreground border-border hover:border-purple-500/30 hover:shadow-md hover:bg-card/80"
              )}
            >
              <div
                className={cn(
                  "transition-all duration-300 group-hover:scale-110",
                  activeTab === index ? "text-white" : "text-muted-foreground"
                )}
              >
                {item.icon}
              </div>
              <div className="text-left">
                <div className="text-sm md:text-base font-semibold">
                  {item.title}
                </div>
                <div
                  className={cn(
                    "text-xs opacity-75",
                    activeTab === index
                      ? "text-white/90"
                      : "text-muted-foreground"
                  )}
                >
                  {item.subtitle}
                </div>
              </div>
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={cn(
                    "p-3 rounded-xl bg-gradient-to-r",
                    technologyItems[activeTab].color
                  )}
                >
                  <div className="text-white">
                    {technologyItems[activeTab].icon}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    <a
                      href={websiteUrls[activeTab]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-purple-600 transition-colors duration-200 inline-flex items-center gap-2 group"
                    >
                      {technologyItems[activeTab].title}
                      <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  </h2>
                  <p className="text-lg text-muted-foreground font-medium">
                    {technologyItems[activeTab].subtitle}
                  </p>
                </div>
              </div>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {technologyItems[activeTab].description}
              </p>
            </motion.div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Key Features
              </h3>
              {technologyItems[activeTab].points.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={cn(
                    "group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2",
                    "hover:scale-[1.02] hover:shadow-lg",
                    hoveredPoint === index
                      ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30 shadow-lg"
                      : "bg-card/50 backdrop-blur-sm border-border hover:border-purple-500/20 hover:bg-card/80"
                  )}
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                        hoveredPoint === index
                          ? `bg-gradient-to-r ${technologyItems[activeTab].color} text-white`
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground mb-2 group-hover:text-purple-600 transition-colors duration-200">
                        {point.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>

                  {hoveredPoint === index && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "absolute bottom-0 left-6 right-6 h-1 rounded-full bg-gradient-to-r origin-left",
                        technologyItems[activeTab].color
                      )}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative h-full">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="sticky top-8"
            >
              <div className="relative w-full h-[40rem] mt-3 rotate-1">
                <motion.div
                  key={`${activeTab}-${hoveredPoint}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-2 border-border/50 bg-card/20 backdrop-blur-sm"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={getCurrentImage() || "/landing/banner.webp"}
                      alt={getCurrentPointInfo().title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      priority={activeTab === 0}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        {getCurrentPointInfo().title}
                      </h4>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {getCurrentPointInfo().description}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div
                  className={cn(
                    "absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-r opacity-20 blur-xl",
                    technologyItems[activeTab].color
                  )}
                />
                <div
                  className={cn(
                    "absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-gradient-to-r opacity-10 blur-2xl",
                    technologyItems[activeTab].color
                  )}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

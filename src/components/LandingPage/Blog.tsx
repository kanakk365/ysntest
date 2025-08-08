"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Newspaper, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type WPFeaturedMedia = {
  source_url?: string;
};

type WPAuthor = {
  name?: string;
  avatar_urls?: Record<string, string>;
};

type WPPost = {
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: WPFeaturedMedia[];
    author?: WPAuthor[];
  };
  link: string;
  date: string;
};

type BlogPost = {
  title: string;
  excerpt: string;
  image: string;
  link: string;
  date: string;
  author: {
    name: string;
    image: string;
  };
};

export default function Blog() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchPosts() {
      try {
        const res = await fetch(
          "https://blog.destinationkp.com/wp-json/wp/v2/posts?_embed&per_page=3"
        );
        const data = (await res.json()) as WPPost[];

        const posts: BlogPost[] = data.map((post) => ({
          title: post.title.rendered,
          excerpt:
            post.excerpt.rendered.replace(/<[^>]+>/g, "").slice(0, 140) + "...",
          image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/landing/banner.webp",
          link: post.link,
          date: new Date(post.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          author: {
            name: post._embedded?.author?.[0]?.name || "Unknown",
            image: post._embedded?.author?.[0]?.avatar_urls?.["96"] || "",
          },
        }));

        if (isMounted) setFeaturedPosts(posts);
      } catch {
        // fail silently for now
      }
    }
    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const header = useMemo(
    () => (
      <div className="relative z-20 py-10 md:pt-16">
        <div className="[perspective:400px] [transform-style:preserve-3d]">
          <motion.div
            initial={{ opacity: 0, rotateX: 0 }}
            animate={{ opacity: 1, rotateX: 25 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`h-14 w-14 p-[4px] rounded-md ${
              isLightTheme
                ? "bg-gradient-to-b from-gray-200 to-gray-300"
                : "bg-gradient-to-b from-neutral-800 to-neutral-950"
            } mx-auto relative`}
            style={{ transformOrigin: "center center" }}
          >
            <div
              className={`$${
                isLightTheme ? "bg-white" : "bg-[rgb(20,20,24)]"
              } rounded-[5px] h-full w-full relative z-20 flex justify-center items-center overflow-hidden`}
            >
              <Newspaper className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600" />
            </div>
            <div
              className={`absolute bottom-0 inset-x-0 ${
                isLightTheme ? "bg-gray-400" : "bg-neutral-600"
              } opacity-50 rounded-full blur-lg h-4 w-full mx-auto z-30`}
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-purple-600 to-transparent h-px w-[60%] mx-auto" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-blue-600 blur-sm to-transparent h-[8px] w-[60%] mx-auto" />
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-5xl mx-auto text-center tracking-tight font-bold text-4xl md:text-5xl md:leading-tight mt-4 mb-2"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Stay Updated
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`text-base md:text-lg max-w-3xl my-3 mx-auto text-center ${
            isLightTheme ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Discover the latest news, updates, and insights about YSN.
        </motion.p>
      </div>
    ),
    [isInView, isLightTheme]
  );

  return (
    <section id="news" className="py-16 md:py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center" ref={containerRef}>
        {header}

        {/* Posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {featuredPosts.map((post, index) => (
            <motion.div
              key={post.link + index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
              className="rounded-2xl border border-gray-800 overflow-hidden  hover:bg-gray-900 transition-colors"
            >
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative h-56 w-full">
                  <Image
                    src={post.image || "/landing/banner.webp"}
                    alt={post.title}
                    fill
                    unoptimized
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-3">{post.excerpt}</p>
                  <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
                    <span>{post.date}</span>
                    <span className="truncate max-w-[50%] text-right">{post.author.name}</span>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-10"
        >
          <a href="https://blog.destinationkp.com/" target="_blank" rel="noopener noreferrer">
            <Button className="h-11 px-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md">
              View All Posts
              <ChevronRight className="w-4 h-4 ml-2 text-white" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}



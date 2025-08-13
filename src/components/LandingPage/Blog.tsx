"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { cubicBezier } from "motion";
import { ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import BlogHeader from "@/components/ui/blog/blog-header";
import BlogCard from "@/components/ui/blog/blog-card";
import BlogSkeleton from "@/components/ui/blog/blog-skeleton";

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

export type BlogPost = {
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

export default function BlogSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          image:
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            "/landing/banner.webp",
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
        if (isMounted) {
          setFeaturedPosts(posts);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
        },
      },
    }),
    []
  );

  return (
    <section
      id="news"
      className={`py-20 md:py-32 ${
        isLightTheme ? "bg-gray-50" : "bg-black"
      } relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div
        className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center relative z-10"
        ref={containerRef}
      >
        <BlogHeader
          isInView={isInView}
          isLightTheme={isLightTheme}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <BlogSkeleton isLightTheme={isLightTheme} />
          ) : (
            <motion.div
              key="posts"
              className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {featuredPosts.map((post, index) => (
                <BlogCard
                  key={post.link + index}
                  post={post}
                  isLightTheme={isLightTheme}
                  itemVariants={itemVariants}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16"
        >
          <a
            href="https://blog.destinationkp.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button className="group h-12 px-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold">
                <span className="mr-2">View All Posts</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

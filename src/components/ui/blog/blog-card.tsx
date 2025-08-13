import { motion } from "motion/react"
import type { Variants } from "motion"
import Image from "next/image"
import { ExternalLink, Clock, User } from "lucide-react"

type BlogCardProps = {
  post: {
    title: string
    excerpt: string
    image: string
    link: string
    date: string
    author: { name: string; image: string }
  }
  isLightTheme: boolean
  itemVariants: Variants
}

export function BlogCard({ post, isLightTheme, itemVariants }: BlogCardProps) {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className={`group rounded-2xl border ${
        isLightTheme
          ? "border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl"
          : "border-gray-800 bg-gray-900 hover:border-gray-700 hover:bg-gray-800"
      } overflow-hidden transition-all duration-300`}
    >
      <a href={post.link} target="_blank" rel="noopener noreferrer" className="block h-full" aria-label={`Read article: ${post.title}`}>
        <div className="relative h-56 w-full overflow-hidden">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4, ease: "easeOut" }} className="h-full w-full">
            <Image src={post.image || "/landing/banner.webp"} alt={post.title} fill unoptimized sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          </motion.div>
          <motion.div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} />
          <motion.div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" initial={{ opacity: 0, scale: 0.8 }} whileHover={{ opacity: 1, scale: 1 }}>
            <ExternalLink className="w-4 h-4 text-gray-700" />
          </motion.div>
        </div>

        <div className="p-6 space-y-4">
          <motion.h3 className={`font-bold text-xl leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors duration-300 ${isLightTheme ? "text-gray-900" : "text-white"}`} whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
            {post.title}
          </motion.h3>
          <p className={`text-base leading-relaxed line-clamp-3 ${isLightTheme ? "text-gray-600" : "text-gray-400"}`}>{post.excerpt}</p>
          <div className={`flex items-center justify-between pt-4 border-t ${isLightTheme ? "border-gray-100" : "border-gray-800"}`}>
            <div className="flex items-center space-x-2">
              <Clock className={`w-4 h-4 ${isLightTheme ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`text-sm ${isLightTheme ? "text-gray-500" : "text-gray-500"}`}>{post.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className={`w-4 h-4 ${isLightTheme ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`text-sm truncate max-w-[120px] ${isLightTheme ? "text-gray-500" : "text-gray-500"}`}>{post.author.name}</span>
            </div>
          </div>
        </div>
      </a>
    </motion.article>
  )
}

export default BlogCard



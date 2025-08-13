import { motion } from "motion/react"

type BlogSkeletonProps = {
  isLightTheme: boolean
}

export function BlogSkeleton({ isLightTheme }: BlogSkeletonProps) {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
    >
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          className={`rounded-2xl border ${isLightTheme ? "border-gray-200 bg-white" : "border-gray-800 bg-gray-900"} overflow-hidden`}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
        >
          <div className={`h-56 w-full ${isLightTheme ? "bg-gray-200" : "bg-gray-800"}`} />
          <div className="p-6 space-y-4">
            <div className={`h-4 ${isLightTheme ? "bg-gray-200" : "bg-gray-800"} rounded`} />
            <div className={`h-3 ${isLightTheme ? "bg-gray-200" : "bg-gray-800"} rounded w-3/4`} />
            <div className={`h-3 ${isLightTheme ? "bg-gray-200" : "bg-gray-800"} rounded w-1/2`} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default BlogSkeleton



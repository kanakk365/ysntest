import { motion, Variants } from "motion/react"
import { cubicBezier } from "motion"
import { Newspaper } from "lucide-react"

type BlogHeaderProps = {
  isInView: boolean
  isLightTheme: boolean
  containerVariants: Variants
  itemVariants: Variants
}

export function BlogHeader({ isInView, isLightTheme, containerVariants, itemVariants }: BlogHeaderProps) {
  return (
    <motion.div
      className="relative z-20 py-12 md:py-20"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.div variants={itemVariants} className="flex justify-center mb-8">
        <div className="[perspective:400px] [transform-style:preserve-3d]">
          <motion.div
            initial={{ opacity: 0, rotateX: 0, scale: 0.8 }}
            animate={{ opacity: 1, rotateX: 25, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
            }}
            whileHover={{
              rotateX: 35,
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
            className={`h-16 w-16 p-[4px] rounded-xl ${
              isLightTheme
                ? "bg-gradient-to-b from-gray-200 to-gray-300"
                : "bg-gradient-to-b from-neutral-800 to-neutral-950"
            } relative cursor-pointer`}
            style={{ transformOrigin: "center center" }}
          >
            <div
              className={`${
                isLightTheme ? "bg-white" : "bg-[rgb(20,20,24)]"
              } rounded-[8px] h-full w-full relative z-20 flex justify-center items-center overflow-hidden`}
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Newspaper className="h-7 w-7 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600" />
              </motion.div>
            </div>

            <motion.div
              className={`absolute bottom-0 inset-x-0 ${
                isLightTheme ? "bg-gray-400" : "bg-neutral-600"
              } opacity-40 rounded-full blur-xl h-5 w-full mx-auto z-30`}
              animate={{
                opacity: [0.4, 0.6, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-purple-600 to-transparent h-px w-[70%] mx-auto" />
            <motion.div
              className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-blue-600 blur-sm to-transparent h-[10px] w-[70%] mx-auto"
              animate={{
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center space-y-6">
        <motion.h2
          className="max-w-4xl mx-auto tracking-tight font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.1]"
          whileInView={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 animate-gradient">
            Latest Insights
          </span>
        </motion.h2>

        <motion.p
          className={`text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed ${
            isLightTheme ? "text-gray-600" : "text-gray-300"
          }`}
          variants={itemVariants}
        >
          Discover cutting-edge updates, expert insights, and industry trends
        </motion.p>

        <motion.p
          className={`text-sm md:text-base max-w-xl mx-auto ${isLightTheme ? "text-gray-500" : "text-gray-400"}`}
          variants={itemVariants}
        >
          Stay ahead with our curated collection of articles and announcements
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export default BlogHeader



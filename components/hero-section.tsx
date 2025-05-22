"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ParticleField from "@/components/particle-field"
import { ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    setIsLoaded(true)

    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY
        const opacity = 1 - Math.min(scrollY / 500, 1)
        heroRef.current.style.opacity = opacity.toString()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      <ParticleField />

      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600">
            Explore the Cosmos
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Journey through NASA's vast collection of space imagery, data, and discoveries
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/apod">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
              Today's Space Image
            </Button>
          </Link>
          <Link href="/planets">
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
            >
              Explore Planets
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -10 }}
        transition={{
          duration: 0.8,
          delay: 1.4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          repeatDelay: 0.2,
        }}
      >
        <ChevronDown className="h-8 w-8 text-gray-700 dark:text-white/70" />
      </motion.div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Rocket } from "lucide-react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "APOD", path: "/apod" },
    { name: "Mars Rover", path: "/mars-rover" },
    { name: "Earth", path: "/earth" },
    { name: "EPIC", path: "/epic" },
    { name: "NEO", path: "/neo" },
    { name: "Gallery", path: "/gallery" },
    { name: "Planets", path: "/planets" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md py-2 border-b border-gray-200 dark:border-gray-800"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-purple-500" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">Cosmic Wanderer</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-purple-600 dark:hover:text-purple-400 ${
                  pathname === link.path ? "text-purple-600 dark:text-purple-500" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-white dark:bg-black z-50 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6 text-gray-900 dark:text-white" />
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-xl font-medium ${
                    pathname === link.path ? "text-purple-600 dark:text-purple-500" : "text-gray-900 dark:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

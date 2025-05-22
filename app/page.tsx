import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeroSection from "@/components/hero-section"
import { Rocket, ImageIcon, Star, Info } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <HeroSection />

      <section className="container mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Explore the Universe</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/apod" className="group">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 border border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-sm">
              <div className="flex items-center mb-4">
                <Star className="h-8 w-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Astronomy Picture of the Day</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Discover the cosmos with NASA's daily featured image and explanation.
              </p>
              <Button
                variant="ghost"
                className="mt-4 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/20 text-purple-600 dark:text-purple-400"
              >
                Explore APOD
              </Button>
            </div>
          </Link>

          <Link href="/mars-rover" className="group">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 border border-gray-200 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-500 shadow-sm">
              <div className="flex items-center mb-4">
                <Rocket className="h-8 w-8 text-red-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mars Rover Photos</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Browse thousands of images captured by NASA's Curiosity, Opportunity, and Spirit rovers.
              </p>
              <Button
                variant="ghost"
                className="mt-4 group-hover:bg-red-100 dark:group-hover:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                Explore Mars
              </Button>
            </div>
          </Link>

          <Link href="/earth" className="group">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm">
              <div className="flex items-center mb-4">
                <ImageIcon className="h-8 w-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Earth Imagery</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                View stunning satellite imagery of our home planet from NASA's Earth Observatory.
              </p>
              <Button
                variant="ghost"
                className="mt-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              >
                Explore Earth
              </Button>
            </div>
          </Link>

          <Link href="/epic" className="group">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-500 shadow-sm">
              <div className="flex items-center mb-4">
                <ImageIcon className="h-8 w-8 text-green-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">EPIC Earth Images</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Daily imagery of Earth from NASA's Earth Polychromatic Imaging Camera.
              </p>
              <Button
                variant="ghost"
                className="mt-4 group-hover:bg-green-100 dark:group-hover:bg-green-900/20 text-green-600 dark:text-green-400"
              >
                View EPIC
              </Button>
            </div>
          </Link>

          <Link href="/neo" className="group">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 border border-gray-200 dark:border-gray-800 hover:border-yellow-500 dark:hover:border-yellow-500 shadow-sm">
              <div className="flex items-center mb-4">
                <Rocket className="h-8 w-8 text-yellow-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Near Earth Objects</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Track asteroids and comets that pass near Earth with NASA's NEO Web Service.
              </p>
              <Button
                variant="ghost"
                className="mt-4 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
              >
                Track NEOs
              </Button>
            </div>
          </Link>

          <Link href="/planets" className="group">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 border border-gray-200 dark:border-gray-800 hover:border-cyan-500 dark:hover:border-cyan-500 shadow-sm">
              <div className="flex items-center mb-4">
                <Info className="h-8 w-8 text-cyan-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Explore Planets</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Discover the planets in our solar system with interactive 3D models.
              </p>
              <Button
                variant="ghost"
                className="mt-4 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400"
              >
                View Planets
              </Button>
            </div>
          </Link>
        </div>
      </section>

      <section className="py-16 relative overflow-hidden bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Interactive Space Gallery</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
            Explore our curated collection of the most breathtaking images from across the cosmos
          </p>
          <Link href="/gallery">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Enter Gallery
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

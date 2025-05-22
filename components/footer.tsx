import Link from "next/link"
import { Rocket, Github, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-purple-500" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">Cosmic Wanderer</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Explore the cosmos with NASA's vast collection of space imagery and data.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/apod"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
                >
                  Astronomy Picture of the Day
                </Link>
              </li>
              <li>
                <Link
                  href="/mars-rover"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
                >
                  Mars Rover Photos
                </Link>
              </li>
              <li>
                <Link
                  href="/earth"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
                >
                  Earth Imagery
                </Link>
              </li>
              <li>
                <Link
                  href="/epic"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
                >
                  EPIC Earth Images
                </Link>
              </li>
              <li>
                <Link
                  href="/neo"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
                >
                  Near Earth Objects
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
                >
                  NASA API Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
                >
                  Space News
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
                >
                  Educational Resources
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
                >
                  Space Research
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
                >
                  API Usage Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm"
                >
                  Image Credits
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>
            This site uses the NASA API but is not endorsed or affiliated with NASA. All NASA images and data are in the
            public domain.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} Cosmic Wanderer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

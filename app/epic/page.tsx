"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, subDays } from "date-fns"
import { CalendarIcon, Download, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { motion } from "framer-motion"
import { getEpicImages } from "@/lib/nasa-api"

interface EpicImage {
  identifier: string
  caption: string
  image: string
  version: string
  date: string
  centroid_coordinates: {
    lat: number
    lon: number
  }
  dscovr_j2000_position: {
    x: number
    y: number
    z: number
  }
  lunar_j2000_position: {
    x: number
    y: number
    z: number
  }
  sun_j2000_position: {
    x: number
    y: number
    z: number
  }
  attitude_quaternions: {
    q0: number
    q1: number
    q2: number
    q3: number
  }
}

export default function EpicPage() {
  const [date, setDate] = useState<Date>(subDays(new Date(), 2)) // EPIC is usually 2 days behind
  const [epicImages, setEpicImages] = useState<EpicImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchEpicImages()
  }, [date])

  const fetchEpicImages = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getEpicImages(format(date, "yyyy-MM-dd"))
      setEpicImages(data)
      setCurrentImageIndex(0)
    } catch (err) {
      setError("Failed to fetch EPIC images. Please try a different date or try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getEpicImageUrl = (image: EpicImage) => {
    const dateStr = image.date.split(" ")[0].replace(/-/g, "/")
    return `https://epic.gsfc.nasa.gov/archive/natural/${dateStr}/png/${image.image}.png`
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? epicImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === epicImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-black">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-6">EPIC Earth Images</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">About EPIC</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    The Earth Polychromatic Imaging Camera (EPIC) takes images of the sunlit side of Earth for various
                    Earth science monitoring purposes. EPIC is onboard NOAA's DSCOVR satellite, which is located at the
                    Earth-Sun Lagrange point (L1), approximately 1.5 million km from Earth.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(date, "MMMM d, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        disabled={(date) => date > subDays(new Date(), 2) || date < new Date("2015-06-13")}
                        className="bg-gray-900 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-gray-500 mt-1">
                    EPIC images are typically available 2-3 days after they are taken.
                  </p>
                </div>

                {epicImages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Available Images</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {epicImages.map((image, index) => (
                        <button
                          key={image.identifier}
                          className={`relative aspect-square rounded-md overflow-hidden border ${
                            index === currentImageIndex ? "border-purple-500" : "border-gray-700 hover:border-gray-500"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <Image
                            src={getEpicImageUrl(image) || "/placeholder.svg"}
                            alt={`EPIC thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              {loading ? (
                <div className="flex justify-center items-center h-96 bg-gray-900 rounded-lg border border-gray-800">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-8 text-center h-96 flex items-center justify-center">
                  <p className="text-red-400">{error}</p>
                </div>
              ) : epicImages.length === 0 ? (
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 text-center h-96 flex flex-col items-center justify-center">
                  <Info className="h-12 w-12 text-gray-700 mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">No Images Available</h3>
                  <p className="text-gray-500 max-w-md">
                    No EPIC images are available for the selected date. Try selecting a different date.
                  </p>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={getEpicImageUrl(epicImages[currentImageIndex]) || "/placeholder.svg"}
                      alt={epicImages[currentImageIndex].caption}
                      fill
                      className="object-contain"
                      priority
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 left-2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {epicImages.length}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-xl font-bold">
                          Earth - {format(new Date(epicImages[currentImageIndex].date), "MMMM d, yyyy")}
                        </h2>
                        <p className="text-sm text-gray-400">{epicImages[currentImageIndex].caption}</p>
                      </div>

                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Image ID</p>
                        <p className="font-medium">{epicImages[currentImageIndex].identifier}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Version</p>
                        <p className="font-medium">{epicImages[currentImageIndex].version}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Centroid Coordinates</p>
                        <p className="font-medium">
                          Lat: {epicImages[currentImageIndex].centroid_coordinates.lat.toFixed(2)}, Lon:{" "}
                          {epicImages[currentImageIndex].centroid_coordinates.lon.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date & Time</p>
                        <p className="font-medium">{epicImages[currentImageIndex].date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

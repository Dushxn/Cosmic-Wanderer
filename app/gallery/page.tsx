"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { getApod } from "@/lib/nasa-api"
import { Download, Info, X, ChevronLeft, ChevronRight } from "lucide-react"

interface GalleryImage {
  id: string
  title: string
  date: string
  url: string
  description: string
  copyright?: string
  type: "image" | "video"
  error?: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [category, setCategory] = useState("featured")

  useEffect(() => {
    fetchGalleryImages()
  }, [category])

  const fetchGalleryImages = async () => {
    setLoading(true)
    setError(null)

    try {
      // For demo purposes, we'll use APOD API to get multiple days
      // In a real app, you would fetch from different NASA APIs based on category
      const today = new Date()
      const promises = []
      const daysToFetch = 20

      // Get last 20 days of APOD
      for (let i = 0; i < daysToFetch; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]
        promises.push(getApod(dateStr))
      }

      const results = await Promise.all(promises)

      const galleryImages: GalleryImage[] = results
        .filter((item) => !item.error) // Filter out items with errors
        .map((item, index) => ({
          id: `apod-${index}`,
          title: item.title || "Untitled",
          date: item.date || "Unknown date",
          url: item.url || "/placeholder.svg?height=800&width=800",
          description: item.explanation || "No description available",
          copyright: item.copyright,
          type: item.media_type === "image" ? "image" : "video",
        }))

      // If we have no valid images, provide some fallback content
      if (galleryImages.length === 0) {
        setError("No images available for the selected category. Please try again later.")
      } else {
        setImages(galleryImages)
      }
    } catch (err) {
      console.error("Failed to fetch gallery images:", err)
      setError("Failed to fetch gallery images. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image)
  }

  const handlePrevImage = () => {
    if (!selectedImage || images.length === 0) return

    const currentIndex = images.findIndex((img) => img.id === selectedImage.id)
    const prevIndex = (currentIndex - 1 + images.length) % images.length
    setSelectedImage(images[prevIndex])
  }

  const handleNextImage = () => {
    if (!selectedImage || images.length === 0) return

    const currentIndex = images.findIndex((img) => img.id === selectedImage.id)
    const nextIndex = (currentIndex + 1) % images.length
    setSelectedImage(images[nextIndex])
  }

  // Fallback images for when the API fails
  const fallbackImages = [
    {
      id: "fallback-1",
      title: "Cosmic Wonder",
      date: "Today",
      url: "/placeholder.svg?height=800&width=800&text=Space+Image",
      description: "A beautiful view of the cosmos.",
      type: "image" as const,
    },
    {
      id: "fallback-2",
      title: "Stellar Formation",
      date: "Yesterday",
      url: "/placeholder.svg?height=800&width=800&text=Stellar+Formation",
      description: "Stars forming in a distant nebula.",
      type: "image" as const,
    },
  ]

  // Use fallback images if we have no real images and are not loading
  const displayImages = images.length > 0 ? images : !loading ? fallbackImages : []

  return (
    <div className="min-h-screen pt-20 pb-16 bg-black">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-6">Space Image Gallery</h1>

          <Tabs defaultValue="featured" onValueChange={setCategory} className="mb-8">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="mars">Mars</TabsTrigger>
              <TabsTrigger value="earth">Earth</TabsTrigger>
              <TabsTrigger value="deep-space">Deep Space</TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="space-y-4">
              <p className="text-gray-400">
                Explore a curated collection of the most stunning space imagery from NASA's archives.
              </p>
            </TabsContent>
            <TabsContent value="mars" className="space-y-4">
              <p className="text-gray-400">
                Discover the Red Planet through the eyes of NASA's Mars rovers and orbiters.
              </p>
            </TabsContent>
            <TabsContent value="earth" className="space-y-4">
              <p className="text-gray-400">
                View our home planet from space through NASA's Earth observation satellites.
              </p>
            </TabsContent>
            <TabsContent value="deep-space" className="space-y-4">
              <p className="text-gray-400">
                Journey to the far reaches of our universe with images from NASA's deep space telescopes.
              </p>
            </TabsContent>
          </Tabs>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          ) : displayImages.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
              <p className="text-gray-400">No images found for this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 group cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <div className="relative aspect-square">
                    {image.type === "image" ? (
                      <Image
                        src={image.url || "/placeholder.svg?height=800&width=800"}
                        alt={image.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized={image.url.includes("nasa.gov")} // Skip optimization for NASA URLs
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <Info className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <h3 className="text-sm font-medium text-white line-clamp-2">{image.title}</h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Image Detail Dialog */}
          <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
            <DialogContent className="sm:max-w-4xl bg-gray-900 border-gray-800 p-0 overflow-hidden">
              <div className="relative">
                {selectedImage?.type === "image" ? (
                  <div className="relative aspect-video">
                    <Image
                      src={selectedImage?.url || "/placeholder.svg?height=800&width=800"}
                      alt={selectedImage?.title || ""}
                      fill
                      className="object-contain"
                      unoptimized={selectedImage?.url.includes("nasa.gov")} // Skip optimization for NASA URLs
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video">
                    <iframe
                      src={selectedImage?.url || ""}
                      title={selectedImage?.title || ""}
                      allowFullScreen
                      className="absolute w-full h-full"
                    />
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>

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
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedImage?.title}</h2>
                    <p className="text-sm text-gray-400">{selectedImage?.date}</p>
                  </div>

                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed max-h-40 overflow-y-auto">
                  {selectedImage?.description}
                </p>

                {selectedImage?.copyright && <p className="mt-4 text-xs text-gray-500">© {selectedImage.copyright}</p>}
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  )
}

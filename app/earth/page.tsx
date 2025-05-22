"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Search, MapPin, Download } from "lucide-react"
import { motion } from "framer-motion"
import { getEarthImagery } from "@/lib/nasa-api"

export default function EarthPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [date, setDate] = useState<Date>(new Date())
  const [lat, setLat] = useState("36.9741")
  const [lon, setLon] = useState("-122.0308")
  const [dim, setDim] = useState(0.15)
  const [metadata, setMetadata] = useState<any>(null)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    setImageUrl(null)
    setMetadata(null)

    try {
      const data = await getEarthImagery(
        Number.parseFloat(lat),
        Number.parseFloat(lon),
        format(date, "yyyy-MM-dd"),
        dim,
      )

      // Check if data exists and has the expected structure
      if (data && typeof data === "object") {
        // For NASA's Earth API, the response might be different than expected
        // Let's handle both possible response formats
        if (data.url) {
          setImageUrl(data.url)
          setMetadata(data)
        } else if (data.image) {
          // Alternative property name
          setImageUrl(data.image)
          setMetadata(data)
        } else {
          // If we can't find an image URL, create a placeholder URL
          setImageUrl(
            `https://api.nasa.gov/planetary/earth/imagery?lon=${lon}&lat=${lat}&date=${format(date, "yyyy-MM-dd")}&dim=${dim}&api_key=rlmBD0kMXKbFSlMRrz0QF5ozQa8rXMECKDMlllA3`,
          )
          setMetadata({
            date: format(date, "yyyy-MM-dd"),
            coordinates: { lat: Number.parseFloat(lat), lon: Number.parseFloat(lon) },
          })
        }
      } else {
        throw new Error("Invalid response format from NASA API")
      }
    } catch (err) {
      console.error("Earth imagery error:", err)
      setError("Failed to fetch Earth imagery. Please try different parameters or try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Default locations
  const defaultLocations = [
    { name: "San Francisco", lat: "37.7749", lon: "-122.4194" },
    { name: "New York", lat: "40.7128", lon: "-74.0060" },
    { name: "Tokyo", lat: "35.6762", lon: "139.6503" },
    { name: "London", lat: "51.5074", lon: "-0.1278" },
    { name: "Sydney", lat: "-33.8688", lon: "151.2093" },
    { name: "Rio de Janeiro", lat: "-22.9068", lon: "-43.1729" },
  ]

  return (
    <div className="min-h-screen pt-20 pb-16 bg-black">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-6">Earth Imagery</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                      <Input type="text" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                      <Input type="text" value={lon} onChange={(e) => setLon(e.target.value)} placeholder="Longitude" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
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
                        disabled={(date) => date > new Date()}
                        className="bg-gray-900 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Image Size (degrees): {dim.toFixed(2)}
                  </label>
                  <Slider value={[dim]} min={0.05} max={0.5} step={0.01} onValueChange={(value) => setDim(value[0])} />
                  <p className="text-xs text-gray-500 mt-1">Controls the width and height of the image in degrees</p>
                </div>

                <Button onClick={handleSearch} className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Search Location
                </Button>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Popular Locations</label>
                  <div className="grid grid-cols-2 gap-2">
                    {defaultLocations.map((location) => (
                      <Button
                        key={location.name}
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        onClick={() => {
                          setLat(location.lat)
                          setLon(location.lon)
                        }}
                      >
                        <MapPin className="mr-1 h-3 w-3" />
                        {location.name}
                      </Button>
                    ))}
                  </div>
                </div>
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
              ) : imageUrl ? (
                <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                  <div className="relative aspect-video">
                    {imageUrl ? (
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={`Earth imagery at coordinates ${lat}, ${lon}`}
                        fill
                        className="object-cover"
                        unoptimized={imageUrl.includes("api.nasa.gov")} // Skip optimization for direct API URLs
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <p className="text-gray-400">No image available</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold mb-1">Earth Imagery</h2>
                        <p className="text-gray-400 text-sm">
                          Coordinates: {lat}, {lon} • Date: {format(date, "MMMM d, yyyy")}
                        </p>
                      </div>

                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    {metadata && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <h3 className="text-sm font-medium mb-2">Image Metadata</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                          <div>
                            <span className="text-gray-500">Date:</span> {metadata.date || "N/A"}
                          </div>
                          <div>
                            <span className="text-gray-500">Coordinates:</span>{" "}
                            {metadata.coordinates
                              ? `${metadata.coordinates.lat.toFixed(4)}, ${metadata.coordinates.lon.toFixed(4)}`
                              : "N/A"}
                          </div>
                          {metadata.cloud_score !== undefined && (
                            <div>
                              <span className="text-gray-500">Cloud Score:</span> {metadata.cloud_score || "N/A"}
                            </div>
                          )}
                          {metadata.id && (
                            <div>
                              <span className="text-gray-500">ID:</span> {metadata.id || "N/A"}
                            </div>
                          )}
                          {metadata.resource && (
                            <div>
                              <span className="text-gray-500">Resource:</span> {metadata.resource.dataset || "N/A"}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 text-center h-96 flex flex-col items-center justify-center">
                  <MapPin className="h-12 w-12 text-gray-700 mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">No Image Selected</h3>
                  <p className="text-gray-500 max-w-md">
                    Enter coordinates and a date to view satellite imagery of Earth from NASA's Earth Observatory.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

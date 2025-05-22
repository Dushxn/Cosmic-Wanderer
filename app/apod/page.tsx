"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Info, Share2, Download, Bookmark } from "lucide-react"
import { motion } from "framer-motion"
import { getApod } from "@/lib/nasa-api"

interface ApodData {
  date: string
  explanation: string
  hdurl?: string
  media_type: string
  service_version: string
  title: string
  url: string
  copyright?: string
  error?: string
}

export default function ApodPage() {
  const [apodData, setApodData] = useState<ApodData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date>(new Date())

  useEffect(() => {
    fetchApodData(format(date, "yyyy-MM-dd"))
  }, [date])

  const fetchApodData = async (dateStr: string) => {
    setLoading(true)
    setError(null)

    try {
      const data = await getApod(dateStr)

      // Check if the API returned an error
      if (data.error) {
        setError(data.error)
        // Still set the data so we can show fallback content
        setApodData({
          date: dateStr,
          title: "Not Available",
          explanation: "No astronomy picture is available for this date.",
          media_type: "image",
          service_version: "v1",
          url: "/placeholder.svg?height=800&width=800&text=No+Image+Available",
          error: data.error,
        })
      } else {
        // Ensure all required fields have values
        setApodData({
          date: data.date || dateStr,
          explanation: data.explanation || "No explanation available.",
          hdurl: data.hdurl,
          media_type: data.media_type || "image",
          service_version: data.service_version || "v1",
          title: data.title || "Astronomy Picture of the Day",
          url: data.url || "/placeholder.svg?height=800&width=800",
          copyright: data.copyright,
        })
      }
    } catch (err) {
      console.error("Failed to fetch APOD data:", err)
      setError("Failed to fetch astronomy picture of the day. Please try again later.")

      // Set fallback data
      setApodData({
        date: dateStr,
        title: "Error Loading Image",
        explanation: "There was an error loading the astronomy picture of the day. Please try again later.",
        media_type: "image",
        service_version: "v1",
        url: "/placeholder.svg?height=800&width=800&text=Error+Loading+Image",
        error: "API error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fallback content for when data is not available
  const fallbackContent = {
    title: "NASA Astronomy Picture of the Day",
    explanation:
      "The NASA Astronomy Picture of the Day (APOD) is a website provided by NASA that features a different astronomical image or photograph each day, along with a brief explanation written by a professional astronomer.",
    url: "/placeholder.svg?height=800&width=800&text=NASA+APOD",
    media_type: "image",
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-6">Astronomy Picture of the Day</h1>

          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {format(date, "MMMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    disabled={(date) => date > new Date() || date < new Date("1995-06-16")}
                    className="bg-gray-900 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error && !apodData ? (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-800">
                {(apodData?.media_type || fallbackContent.media_type) === "image" ? (
                  <Image
                    src={apodData?.url || fallbackContent.url}
                    alt={apodData?.title || fallbackContent.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized={apodData?.url?.includes("nasa.gov")} // Skip optimization for NASA URLs
                  />
                ) : (
                  <iframe
                    src={apodData?.url}
                    title={apodData?.title || "NASA Video"}
                    allowFullScreen
                    className="absolute w-full h-full"
                  />
                )}
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-2xl font-bold mb-2">{apodData?.title || fallbackContent.title}</h2>
                {apodData?.copyright && <p className="text-sm text-gray-400 mb-4">© {apodData.copyright}</p>}
                <p className="text-gray-300 leading-relaxed">{apodData?.explanation || fallbackContent.explanation}</p>

                <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-400">
                    <Info className="h-4 w-4 mr-2" />
                    <span>Date: {apodData?.date || format(date, "yyyy-MM-dd")}</span>
                  </div>

                  {apodData?.hdurl && (
                    <a
                      href={apodData.hdurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      View High Resolution
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

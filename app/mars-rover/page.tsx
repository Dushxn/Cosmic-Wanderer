"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Camera, Calendar, Filter, Download } from "lucide-react"

interface RoverPhoto {
  id: number
  sol: number
  camera: {
    id: number
    name: string
    rover_id: number
    full_name: string
  }
  img_src: string
  earth_date: string
  rover: {
    id: number
    name: string
    landing_date: string
    launch_date: string
    status: string
  }
}

export default function MarsRoverPage() {
  const [photos, setPhotos] = useState<RoverPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rover, setRover] = useState("curiosity")
  const [sol, setSol] = useState("1000")
  const [camera, setCamera] = useState("all")

  useEffect(() => {
    fetchRoverPhotos()
  }, [rover, sol, camera])

  const fetchRoverPhotos = async () => {
    setLoading(true)
    setError(null)

    try {
      let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=rlmBD0kMXKbFSlMRrz0QF5ozQa8rXMECKDMlllA3`

      if (camera !== "all") {
        url += `&camera=${camera}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`)
      }

      const data = await response.json()
      setPhotos(data.photos.slice(0, 20)) // Limit to 20 photos for performance
    } catch (err) {
      setError("Failed to fetch Mars rover photos. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const cameraOptions = {
    curiosity: [
      { value: "fhaz", label: "Front Hazard Avoidance Camera" },
      { value: "rhaz", label: "Rear Hazard Avoidance Camera" },
      { value: "mast", label: "Mast Camera" },
      { value: "chemcam", label: "Chemistry and Camera Complex" },
      { value: "mahli", label: "Mars Hand Lens Imager" },
      { value: "mardi", label: "Mars Descent Imager" },
      { value: "navcam", label: "Navigation Camera" },
    ],
    opportunity: [
      { value: "fhaz", label: "Front Hazard Avoidance Camera" },
      { value: "rhaz", label: "Rear Hazard Avoidance Camera" },
      { value: "navcam", label: "Navigation Camera" },
      { value: "pancam", label: "Panoramic Camera" },
      { value: "minites", label: "Miniature Thermal Emission Spectrometer" },
    ],
    spirit: [
      { value: "fhaz", label: "Front Hazard Avoidance Camera" },
      { value: "rhaz", label: "Rear Hazard Avoidance Camera" },
      { value: "navcam", label: "Navigation Camera" },
      { value: "pancam", label: "Panoramic Camera" },
      { value: "minites", label: "Miniature Thermal Emission Spectrometer" },
    ],
    perseverance: [
      { value: "edl_rucam", label: "Rover Up-Look Camera" },
      { value: "edl_rdcam", label: "Rover Down-Look Camera" },
      { value: "edl_ddcam", label: "Descent Stage Down-Look Camera" },
      { value: "edl_pucam1", label: "Parachute Up-Look Camera A" },
      { value: "edl_pucam2", label: "Parachute Up-Look Camera B" },
      { value: "navcam_left", label: "Navigation Camera - Left" },
      { value: "navcam_right", label: "Navigation Camera - Right" },
      { value: "mcz_right", label: "Mastcam-Z Right" },
      { value: "mcz_left", label: "Mastcam-Z Left" },
      { value: "front_hazcam_left_a", label: "Front Hazard Avoidance Camera - Left" },
      { value: "front_hazcam_right_a", label: "Front Hazard Avoidance Camera - Right" },
      { value: "rear_hazcam_left", label: "Rear Hazard Avoidance Camera - Left" },
      { value: "rear_hazcam_right", label: "Rear Hazard Avoidance Camera - Right" },
    ],
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-black">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-6">Mars Rover Photos</h1>

          <Tabs defaultValue="curiosity" className="mb-8" onValueChange={(value) => setRover(value)}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="curiosity">Curiosity</TabsTrigger>
              <TabsTrigger value="opportunity">Opportunity</TabsTrigger>
              <TabsTrigger value="spirit">Spirit</TabsTrigger>
              <TabsTrigger value="perseverance">Perseverance</TabsTrigger>
            </TabsList>

            <TabsContent value="curiosity" className="space-y-4">
              <p className="text-gray-400">
                The Curiosity rover has been exploring Mars since 2012, examining Gale Crater for signs of past
                habitability.
              </p>
            </TabsContent>
            <TabsContent value="opportunity" className="space-y-4">
              <p className="text-gray-400">
                The Opportunity rover explored Mars from 2004 to 2018, setting a record for the longest distance driven
                on another world.
              </p>
            </TabsContent>
            <TabsContent value="spirit" className="space-y-4">
              <p className="text-gray-400">
                The Spirit rover explored Mars from 2004 to 2010, examining volcanic rocks and searching for evidence of
                past water.
              </p>
            </TabsContent>
            <TabsContent value="perseverance" className="space-y-4">
              <p className="text-gray-400">
                The Perseverance rover landed in 2021 and is searching for signs of ancient microbial life in Jezero
                Crater.
              </p>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sol (Martian Day)</label>
              <Select value={sol} onValueChange={setSol}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Sol 1</SelectItem>
                  <SelectItem value="100">Sol 100</SelectItem>
                  <SelectItem value="500">Sol 500</SelectItem>
                  <SelectItem value="1000">Sol 1000</SelectItem>
                  <SelectItem value="2000">Sol 2000</SelectItem>
                  <SelectItem value="3000">Sol 3000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Camera</label>
              <Select value={camera} onValueChange={setCamera}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Camera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cameras</SelectItem>
                  {cameraOptions[rover as keyof typeof cameraOptions].map((cam) => (
                    <SelectItem key={cam.value} value={cam.value}>
                      {cam.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={fetchRoverPhotos} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
              <p className="text-gray-400">No photos found for the selected filters. Try different settings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 group"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={photo.img_src || "/placeholder.svg"}
                      alt={`Mars Rover ${photo.rover.name} - ${photo.camera.full_name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Camera className="h-4 w-4 text-purple-400 mr-2" />
                            <span className="text-sm text-white">{photo.camera.full_name}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="text-white">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{photo.earth_date}</span>
                      </div>
                      <span className="text-purple-400">Sol {photo.sol}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

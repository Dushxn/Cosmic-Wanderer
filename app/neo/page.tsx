"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays, differenceInDays } from "date-fns"
import { CalendarIcon, AlertTriangle, Search, Info } from "lucide-react"
import { motion } from "framer-motion"
import { getNeoFeed } from "@/lib/nasa-api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface NeoObject {
  id: string
  name: string
  absolute_magnitude_h: number
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
  }
  is_potentially_hazardous_asteroid: boolean
  close_approach_data: Array<{
    close_approach_date: string
    relative_velocity: {
      kilometers_per_hour: string
    }
    miss_distance: {
      kilometers: string
    }
  }>
}

export default function NeoPage() {
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7))
  const [neoData, setNeoData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (differenceInDays(endDate, startDate) > 7) {
      setError("Date range cannot exceed 7 days due to API limitations.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getNeoFeed(format(startDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd"))

      setNeoData(data)
    } catch (err) {
      setError("Failed to fetch NEO data. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Get all NEOs across all dates
  const getAllNeos = () => {
    if (!neoData || !neoData.near_earth_objects) return []

    const allNeos: NeoObject[] = []

    Object.keys(neoData.near_earth_objects).forEach((date) => {
      neoData.near_earth_objects[date].forEach((neo: NeoObject) => {
        allNeos.push(neo)
      })
    })

    return allNeos
  }

  // Get count of potentially hazardous asteroids
  const getHazardousCount = () => {
    return getAllNeos().filter((neo) => neo.is_potentially_hazardous_asteroid).length
  }

  // Get largest asteroid by estimated diameter
  const getLargestAsteroid = () => {
    const allNeos = getAllNeos()
    if (allNeos.length === 0) return null

    return allNeos.reduce((largest, current) => {
      const largestDiameter = largest.estimated_diameter.kilometers.estimated_diameter_max
      const currentDiameter = current.estimated_diameter.kilometers.estimated_diameter_max

      return currentDiameter > largestDiameter ? current : largest
    }, allNeos[0])
  }

  // Get closest approach
  const getClosestApproach = () => {
    const allNeos = getAllNeos()
    if (allNeos.length === 0) return null

    let closest = allNeos[0]
    let closestDistance = Number.parseFloat(allNeos[0].close_approach_data[0].miss_distance.kilometers)

    allNeos.forEach((neo) => {
      const distance = Number.parseFloat(neo.close_approach_data[0].miss_distance.kilometers)
      if (distance < closestDistance) {
        closest = neo
        closestDistance = distance
      }
    })

    return closest
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-black">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-6">Near Earth Objects</h1>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-8">
            <h2 className="text-xl font-bold mb-4">Search Parameters</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, "MMMM d, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      className="bg-gray-900 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(endDate, "MMMM d, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      className="bg-gray-900 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {differenceInDays(endDate, startDate) > 7 && (
              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-6 flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-yellow-400 text-sm">Date range cannot exceed 7 days due to API limitations.</p>
              </div>
            )}

            <Button
              onClick={handleSearch}
              disabled={differenceInDays(endDate, startDate) > 7 || loading}
              className="w-full md:w-auto"
            >
              <Search className="mr-2 h-4 w-4" />
              Search NEOs
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          ) : neoData ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total NEOs</CardTitle>
                    <CardDescription className="text-gray-400">Near Earth Objects found</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{neoData.element_count}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Potentially Hazardous</CardTitle>
                    <CardDescription className="text-gray-400">Asteroids that could pose a threat</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-500">{getHazardousCount()}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Date Range</CardTitle>
                    <CardDescription className="text-gray-400">Period of observation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-medium">
                      {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                      Closest Approach
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Asteroid with the closest approach to Earth
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const closest = getClosestApproach()
                      if (!closest) return null

                      return (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-bold">{closest.name}</h3>
                            <p className="text-sm text-gray-400">ID: {closest.id}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Miss Distance</p>
                              <p className="text-lg font-medium">
                                {Number.parseInt(
                                  closest.close_approach_data[0].miss_distance.kilometers,
                                ).toLocaleString()}{" "}
                                km
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Velocity</p>
                              <p className="text-lg font-medium">
                                {Number.parseInt(
                                  closest.close_approach_data[0].relative_velocity.kilometers_per_hour,
                                ).toLocaleString()}{" "}
                                km/h
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Approach Date</p>
                              <p className="text-lg font-medium">
                                {closest.close_approach_data[0].close_approach_date}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Hazardous</p>
                              <p
                                className={`text-lg font-medium ${closest.is_potentially_hazardous_asteroid ? "text-yellow-500" : "text-green-500"}`}
                              >
                                {closest.is_potentially_hazardous_asteroid ? "Yes" : "No"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 text-blue-500 mr-2" />
                      Largest Asteroid
                    </CardTitle>
                    <CardDescription className="text-gray-400">Largest asteroid by estimated diameter</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const largest = getLargestAsteroid()
                      if (!largest) return null

                      return (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-bold">{largest.name}</h3>
                            <p className="text-sm text-gray-400">ID: {largest.id}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Estimated Diameter</p>
                              <p className="text-lg font-medium">
                                {largest.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Absolute Magnitude</p>
                              <p className="text-lg font-medium">{largest.absolute_magnitude_h.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Approach Date</p>
                              <p className="text-lg font-medium">
                                {largest.close_approach_data[0].close_approach_date}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Hazardous</p>
                              <p
                                className={`text-lg font-medium ${largest.is_potentially_hazardous_asteroid ? "text-yellow-500" : "text-green-500"}`}
                              >
                                {largest.is_potentially_hazardous_asteroid ? "Yes" : "No"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">All Near Earth Objects</h2>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Diameter (km)</TableHead>
                        <TableHead>Close Approach</TableHead>
                        <TableHead>Miss Distance</TableHead>
                        <TableHead>Velocity</TableHead>
                        <TableHead>Hazardous</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getAllNeos().map((neo) => (
                        <TableRow key={neo.id}>
                          <TableCell className="font-medium">{neo.name}</TableCell>
                          <TableCell>{neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)}</TableCell>
                          <TableCell>{neo.close_approach_data[0].close_approach_date}</TableCell>
                          <TableCell>
                            {Number.parseInt(neo.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km
                          </TableCell>
                          <TableCell>
                            {Number.parseInt(
                              neo.close_approach_data[0].relative_velocity.kilometers_per_hour,
                            ).toLocaleString()}{" "}
                            km/h
                          </TableCell>
                          <TableCell>
                            <span
                              className={neo.is_potentially_hazardous_asteroid ? "text-yellow-500" : "text-green-500"}
                            >
                              {neo.is_potentially_hazardous_asteroid ? "Yes" : "No"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
              <p className="text-gray-400">
                Select a date range and click "Search NEOs" to view near Earth objects data.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

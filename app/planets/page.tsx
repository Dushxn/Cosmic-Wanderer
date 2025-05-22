"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, Maximize2 } from "lucide-react"

// Planet 3D model component using Sketchfab embeds
const PlanetModel = ({ planetName }) => {
  // Map planet names to their Sketchfab model IDs
  const planetModels = {
    mercury: "32347fa4ec1a4987b71f461a401d91c4",
    venus: "b306aaadbf2b4fcea1afa2db5ed75b4f",
    earth: "3684eb40fb7e42208089874e6286b9e9",
    mars: "2b46962637ee4311af8f0d1d0709fbb2",
    jupiter: "993ba62a539e4c308e9e3137df454ed6",
    saturn: "81bcb0c25c4f4e03bb7387e7bfbd44f7",
    uranus: "b488282fa28344009fa8c8cdb3384456",
    neptune: "947a405a0a4348f9a49ff4bd3ed3cc4b",
  }

  // Sketchfab creators for attribution
  const planetCreators = {
    mercury: "Akshat",
    venus: "kongle",
    earth: "denis_cliofas",
    mars: "Mieke Roth",
    jupiter: "Shady Tex",
    saturn: "kongle",
    uranus: "kongle",
    neptune: "Akshat",
  }

  // Get the model ID and creator for the current planet
  const modelId = planetModels[planetName]
  const creator = planetCreators[planetName]

  // Capitalize planet name for display
  const displayName = planetName.charAt(0).toUpperCase() + planetName.slice(1)

  return (
    <div className="w-full h-full relative">
      <iframe
        title={displayName}
        className="w-full h-full border-0 absolute inset-0"
        allowFullScreen
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        src={`https://sketchfab.com/models/${modelId}/embed?autospin=1&autostart=1&ui_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&camera=0`}
      />
      
    </div>
  )
}

// Loading indicator for when iframe is loading
const PlanetLoading = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )
}

export default function PlanetsPage() {
  const [activePlanet, setActivePlanet] = useState("earth")
  const [fullscreen, setFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const planets = {
    mercury: {
      name: "Mercury",
      description:
        "Mercury is the smallest and innermost planet in the Solar System. It has no natural satellites and no substantial atmosphere.",
      facts: [
        "Mercury is the fastest planet, orbiting the Sun every 88 Earth days",
        "Mercury's surface resembles that of the Moon with numerous impact craters",
        "Despite being closest to the Sun, Venus is hotter than Mercury",
        "Mercury has a large iron core that takes up about 60% of its mass",
      ],
    },
    venus: {
      name: "Venus",
      description:
        "Venus is the second planet from the Sun and is Earth's closest planetary neighbor. It's one of the four inner, terrestrial planets, and it's often called Earth's twin because it's similar in size and density.",
      facts: [
        "Venus rotates backward compared to other planets",
        "A day on Venus is longer than a year on Venus",
        "Venus has the hottest surface of any planet in our solar system",
        "The atmospheric pressure on Venus is 92 times greater than Earth's",
      ],
    },
    earth: {
      name: "Earth",
      description:
        "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is covered with water, with the remaining 29% consisting of continents and islands.",
      facts: [
        "Earth is the only planet not named after a god",
        "Earth has a powerful magnetic field created by its nickel-iron core",
        "Earth's atmosphere is composed of 78% nitrogen, 21% oxygen, and 1% other gases",
        "Earth has one natural satellite - the Moon",
      ],
    },
    mars: {
      name: "Mars",
      description:
        "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, being larger than only Mercury. It is often referred to as the 'Red Planet' because of its reddish appearance.",
      facts: [
        "Mars has the largest dust storms in the solar system",
        "Mars has two moons, Phobos and Deimos",
        "Mars has the tallest mountain in the solar system - Olympus Mons",
        "The red color of Mars is due to iron oxide (rust) on its surface",
      ],
    },
    jupiter: {
      name: "Jupiter",
      description:
        "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined.",
      facts: [
        "Jupiter has the shortest day of all the planets",
        "Jupiter has the Great Red Spot, a giant storm that has lasted for hundreds of years",
        "Jupiter has a faint ring system and at least 79 moons",
        "Jupiter's magnetic field is 14 times stronger than Earth's",
      ],
    },
    saturn: {
      name: "Saturn",
      description:
        "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius of about nine and a half times that of Earth.",
      facts: [
        "Saturn has the most extensive ring system of any planet",
        "Saturn has at least 82 moons, with Titan being the largest",
        "Saturn is the least dense planet in the Solar System - it would float in water",
        "Saturn's upper atmosphere is divided into bands of clouds",
      ],
    },
    uranus: {
      name: "Uranus",
      description:
        "Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. It is similar in composition to Neptune, and both have bulk chemical compositions which differ from that of the larger gas giants Jupiter and Saturn.",
      facts: [
        "Uranus rotates on its side with an axial tilt of 98 degrees",
        "Uranus has 13 known rings and 27 known moons",
        "Uranus is the coldest planetary atmosphere in the Solar System",
        "Uranus appears blue-green due to methane in its atmosphere",
      ],
    },
    neptune: {
      name: "Neptune",
      description:
        "Neptune is the eighth and farthest-known Solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet.",
      facts: [
        "Neptune was the first planet located through mathematical predictions rather than observation",
        "Neptune has the strongest winds in the Solar System, reaching up to 2,100 km/h",
        "Neptune has 14 known moons, with Triton being the largest",
        "Neptune has six rings, though they are very faint",
      ],
    },
  }

  return (
    <div
      className={`min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-black text-gray-900 dark:text-white ${fullscreen ? "fixed inset-0 z-50" : ""}`}
    >
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {!fullscreen && <h1 className="text-4xl font-bold mb-6">Explore the Planets</h1>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {!fullscreen && (
              <div className="lg:col-span-1">
                <Tabs defaultValue="earth" onValueChange={setActivePlanet} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="mercury">Mercury</TabsTrigger>
                    <TabsTrigger value="venus">Venus</TabsTrigger>
                    <TabsTrigger value="earth">Earth</TabsTrigger>
                    <TabsTrigger value="mars">Mars</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="jupiter">Jupiter</TabsTrigger>
                    <TabsTrigger value="saturn">Saturn</TabsTrigger>
                    <TabsTrigger value="uranus">Uranus</TabsTrigger>
                    <TabsTrigger value="neptune">Neptune</TabsTrigger>
                  </TabsList>

                  {Object.keys(planets).map((planet) => (
                    <TabsContent key={planet} value={planet} className="mt-6">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                          {planets[planet].name}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">{planets[planet].description}</p>

                        <h3 className="text-lg font-medium mb-3 flex items-center text-gray-900 dark:text-white">
                          <Info className="h-4 w-4 mr-2 text-purple-500" />
                          Key Facts
                        </h3>
                        <ul className="space-y-2">
                          {planets[planet].facts.map((fact, index) => (
                            <li key={index} className="text-gray-600 dark:text-gray-400 flex items-start">
                              <span className="text-purple-500 mr-2">•</span>
                              {fact}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}

            <div className={fullscreen ? "w-full h-screen" : "lg:col-span-2 h-[500px] relative"}>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                onClick={() => setFullscreen(!fullscreen)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>

              <div className="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                <PlanetModel planetName={activePlanet} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

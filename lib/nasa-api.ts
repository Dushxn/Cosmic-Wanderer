// NASA API key
const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY

// Base URLs for different NASA APIs
const APOD_URL = "https://api.nasa.gov/planetary/apod"
const MARS_ROVER_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers"
const EARTH_IMAGERY_URL = "https://api.nasa.gov/planetary/earth/imagery"
const EPIC_URL = "https://api.nasa.gov/EPIC/api/natural"
const NEO_URL = "https://api.nasa.gov/neo/rest/v1/feed"
const TECHPORT_URL = "https://api.nasa.gov/techport/api/projects"

// APOD - Astronomy Picture of the Day
export async function getApod(date?: string) {
  let url = `${APOD_URL}?api_key=${NASA_API_KEY}`

  if (date) {
    url += `&date=${date}`
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 404) {
        console.warn(`No APOD available for date: ${date}`)
        return {
          error: "No image available for this date",
          date: date,
          title: "Not Available",
          url: "/placeholder.svg?height=800&width=800",
          media_type: "image",
          explanation: "No astronomy picture is available for this date.",
        }
      }

      throw new Error(`NASA API error: ${response.status}`)
    }

    return await response.json()
  } catch (err) {
    console.error(`Error fetching APOD for date ${date}:`, err)
    // Return a fallback object instead of throwing
    return {
      error: "Failed to fetch image",
      date: date,
      title: "Error",
      url: "/placeholder.svg?height=800&width=800",
      media_type: "image",
      explanation: "There was an error fetching the astronomy picture of the day.",
    }
  }
}

// Mars Rover Photos
export async function getMarsRoverPhotos(rover: string, sol: string, camera?: string) {
  let url = `${MARS_ROVER_URL}/${rover}/photos?sol=${sol}&api_key=${NASA_API_KEY}`

  if (camera && camera !== "all") {
    url += `&camera=${camera}`
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`)
    }

    return await response.json()
  } catch (err) {
    console.error("Error fetching Mars rover photos:", err)
    return { photos: [] }
  }
}

// Earth Imagery
export async function getEarthImagery(lat: number, lon: number, date?: string, dim?: number) {
  let url = `${EARTH_IMAGERY_URL}?lat=${lat}&lon=${lon}&api_key=${NASA_API_KEY}`

  if (date) {
    url += `&date=${date}`
  }

  if (dim) {
    url += `&dim=${dim}`
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      // For Earth imagery, the API might return a 404 if no image is available
      if (response.status === 404) {
        return {
          url: null,
          error: "No imagery available for the selected location and date.",
        }
      }
      throw new Error(`NASA API error: ${response.status}`)
    }

    // The Earth imagery API might return an image directly rather than JSON
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("image/")) {
      return {
        url: url,
        date: date,
        coordinates: { lat, lon },
      }
    }

    // Otherwise, try to parse as JSON
    return await response.json()
  } catch (err) {
    console.error("Error fetching Earth imagery:", err)
    return {
      url: null,
      error: "Failed to fetch Earth imagery. Please try different parameters or try again later.",
    }
  }
}

// EPIC - Earth Polychromatic Imaging Camera
export async function getEpicImages(date?: string) {
  let url = `${EPIC_URL}?api_key=${NASA_API_KEY}`

  if (date) {
    url += `&date=${date}`
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`)
    }

    return await response.json()
  } catch (err) {
    console.error("Error fetching EPIC images:", err)
    return []
  }
}

// NEO - Near Earth Object Web Service
export async function getNeoFeed(startDate: string, endDate: string) {
  const url = `${NEO_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`)
    }

    return await response.json()
  } catch (err) {
    console.error("Error fetching NEO data:", err)
    return {
      element_count: 0,
      near_earth_objects: {},
    }
  }
}

// TechPort - NASA Technology Portfolio
export async function getTechportProjects(updatedSince?: string) {
  let url = `${TECHPORT_URL}?api_key=${NASA_API_KEY}`

  if (updatedSince) {
    url += `&updatedSince=${updatedSince}`
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`)
    }

    return await response.json()
  } catch (err) {
    console.error("Error fetching TechPort projects:", err)
    return { projects: [] }
  }
}

// Get project details from TechPort
export async function getTechportProjectDetails(id: string) {
  const url = `${TECHPORT_URL}/${id}?api_key=${NASA_API_KEY}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`)
    }

    return await response.json()
  } catch (err) {
    console.error(`Error fetching TechPort project details for ID ${id}:`, err)
    return { error: "Failed to fetch project details" }
  }
}

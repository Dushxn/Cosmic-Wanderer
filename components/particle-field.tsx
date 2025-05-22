"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  alpha: number
  connection: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Initialize particles
  useEffect(() => {
    setMounted(true)

    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        setDimensions({ width: canvas.width, height: canvas.height })

        // Recreate particles when resizing
        initParticles()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Re-initialize particles when theme changes
  useEffect(() => {
    if (mounted) {
      initParticles()
    }
  }, [theme, mounted])

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const animate = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      updateParticles(ctx)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [dimensions, mousePosition, theme])

  const initParticles = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
    const particles: Particle[] = []

    // Different star colors based on theme
    const starColors =
      theme === "dark"
        ? ["#ffffff", "#fffafa", "#f8f8ff", "#e6e6fa", "#b0c4de"] // Bright colors for dark theme
        : ["#4a4a4a", "#5a5a5a", "#6a6a6a", "#7a7a7a", "#8a8a8a"] // Darker colors for light theme

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.2 - 0.1,
        speedY: Math.random() * 0.2 - 0.1,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        alpha: Math.random() * 0.8 + 0.2,
        connection: Math.random() * 100 + 50,
      })
    }

    particlesRef.current = particles
  }

  const updateParticles = (ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current
    const canvas = canvasRef.current
    if (!canvas) return

    // Draw connections first (behind particles)
    ctx.lineWidth = 0.3

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i]

      // Mouse interaction - attract particles
      const dx = mousePosition.x - p1.x
      const dy = mousePosition.y - p1.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 150) {
        const angle = Math.atan2(dy, dx)
        const force = (150 - distance) / 1500
        p1.speedX += Math.cos(angle) * force
        p1.speedY += Math.sin(angle) * force
      }

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < p1.connection) {
          // Calculate opacity based on distance
          const opacity = 1 - distance / p1.connection

          // Draw connection with theme-appropriate color
          const connectionColor =
            theme === "dark" ? `rgba(100, 100, 255, ${opacity * 0.2})` : `rgba(100, 100, 200, ${opacity * 0.1})`

          ctx.beginPath()
          ctx.strokeStyle = connectionColor
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
    }

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // Update position
      p.x += p.speedX
      p.y += p.speedY

      // Apply friction
      p.speedX *= 0.99
      p.speedY *= 0.99

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0

      // Draw particle
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.alpha
      ctx.fill()
      ctx.globalAlpha = 1
    }
  }

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full bg-gray-50 dark:bg-black" />
}

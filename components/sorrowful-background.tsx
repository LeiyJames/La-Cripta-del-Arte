"use client"

import { useEffect, useRef, useState } from "react"

export function SorrowfulBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [teardrops, setTeardrops] = useState<JSX.Element[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Smudge class
    class Smudge {
      x: number
      y: number
      size: number
      opacity: number
      color: string
      vx: number
      vy: number
      life: number
      maxLife: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 100 + 50
        this.opacity = Math.random() * 0.07 + 0.03

        // Colors: moody blues, bruised purples
        const colors = [
          "57, 72, 103", // moody blue
          "33, 42, 62", // deep blue
          "92, 84, 112", // bruised purple
          "53, 47, 68", // dark purple
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]

        this.vx = Math.random() * 0.2 - 0.1
        this.vy = Math.random() * 0.2 - 0.1
        this.life = 0
        this.maxLife = Math.random() * 300 + 200
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.life++

        // Fade in and out
        let lifeOpacity = this.opacity
        if (this.life < 50) {
          lifeOpacity = (this.life / 50) * this.opacity
        } else if (this.life > this.maxLife - 50) {
          lifeOpacity = ((this.maxLife - this.life) / 50) * this.opacity
        }

        return {
          x: this.x,
          y: this.y,
          size: this.size,
          opacity: lifeOpacity,
          color: this.color,
          isDead: this.life >= this.maxLife,
        }
      }
    }

    // Create smudges
    const smudges: Smudge[] = []
    const maxSmudges = 15

    for (let i = 0; i < maxSmudges; i++) {
      smudges.push(new Smudge())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(26, 26, 46, 0.9)") // smudged black
      gradient.addColorStop(0.5, "rgba(33, 42, 62, 0.9)") // deep blue
      gradient.addColorStop(1, "rgba(26, 26, 46, 0.9)") // smudged black
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw smudges
      for (let i = 0; i < smudges.length; i++) {
        const smudgeData = smudges[i].update()

        if (smudgeData.isDead) {
          smudges[i] = new Smudge()
          continue
        }

        // Draw smudge
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(
          smudgeData.x,
          smudgeData.y,
          0,
          smudgeData.x,
          smudgeData.y,
          smudgeData.size,
        )
        gradient.addColorStop(0, `rgba(${smudgeData.color}, ${smudgeData.opacity})`)
        gradient.addColorStop(1, `rgba(${smudgeData.color}, 0)`)

        ctx.fillStyle = gradient
        ctx.arc(smudgeData.x, smudgeData.y, smudgeData.size, 0, Math.PI * 2)
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Create teardrops
    const createTeardrops = () => {
      const newTeardrops = []
      const count = Math.floor(Math.random() * 3) + 1

      for (let i = 0; i < count; i++) {
        const left = Math.random() * 100
        const delay = Math.random() * 5
        const duration = Math.random() * 3 + 5
        const opacity = Math.random() * 0.3 + 0.1

        newTeardrops.push(
          <div
            key={`teardrop-${Date.now()}-${i}`}
            className="teardrop"
            style={{
              left: `${left}%`,
              opacity: opacity,
              animation: `teardrop-fall ${duration}s ease-in ${delay}s infinite`,
            }}
          />,
        )
      }

      setTeardrops((prev) => [...prev, ...newTeardrops])

      // Limit the number of teardrops
      if (teardrops.length > 20) {
        setTeardrops((prev) => prev.slice(-20))
      }
    }

    // Create teardrops periodically
    const teardropInterval = setInterval(createTeardrops, 3000)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      clearInterval(teardropInterval)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" aria-hidden="true" />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-5">{teardrops}</div>
    </>
  )
}

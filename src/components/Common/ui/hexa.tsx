"use client"

import { useRef, useEffect, useCallback } from "react"

interface CanvasAnimationProps {
  containerWidth: number
  containerHeight: number
}

export default function CanvasAnimation({ containerWidth, containerHeight }: CanvasAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const animationFrameIdRef = useRef<number | null>(null)

  // Animation options and state variables, stored in refs for mutability without re-renders
  const optsRef = useRef({
    len: 20,
    count: 50,
    baseTime: 10,
    addedTime: 10,
    dieChance: 0.05,
    spawnChance: 1, // This will be effectively ignored as lines are pre-spawned
    sparkChance: 0.1,
    sparkDist: 10,
    sparkSize: 2,
    color: "hsl(hue,100%,light%)",
    baseLight: 50,
    addedLight: 10, // [50-10,50+10]
    shadowToTimePropMult: 6,
    baseLightInputMultiplier: 0.01,
    addedLightInputMultiplier: 0.02,
    cx: 0, // Will be set dynamically based on containerWidth
    cy: 0, // Will be set dynamically based on containerHeight
    repaintAlpha: 0.04,
    hueChange: 0.1,
  })

  const tickRef = useRef(0)
  const linesRef = useRef<Line[]>([])
  const dieXRef = useRef(0)
  const dieYRef = useRef(0)
  const baseRadRef = useRef((Math.PI * 2) / 6)

  // Define the Line class inside the component to access refs directly
  class Line {
    x = 0
    y = 0
    addedX = 0
    addedY = 0
    rad = 0
    lightInputMultiplier = 0
    color = ""
    cumulativeTime = 0
    time = 0
    targetTime = 0

    constructor() {
      this.reset()
    }

    reset() {
      const opts = optsRef.current
      const tick = tickRef.current

      this.x = 0
      this.y = 0
      this.addedX = 0
      this.addedY = 0
      this.rad = 0
      this.lightInputMultiplier = opts.baseLightInputMultiplier + opts.addedLightInputMultiplier * Math.random()
      this.color = opts.color.replace("hue", String(tick * opts.hueChange))
      this.cumulativeTime = 0
      this.beginPhase()
    }

    beginPhase() {
      const opts = optsRef.current
      const dieX = dieXRef.current
      const dieY = dieYRef.current
      const baseRad = baseRadRef.current

      this.x += this.addedX
      this.y += this.addedY
      this.time = 0
      this.targetTime = (opts.baseTime + opts.addedTime * Math.random()) | 0
      this.rad += baseRad * (Math.random() < 0.5 ? 1 : -1)
      this.addedX = Math.cos(this.rad)
      this.addedY = Math.sin(this.rad)

      // Check if line should die based on new container boundaries
      if (Math.random() < opts.dieChance || this.x > dieX || this.x < -dieX || this.y > dieY || this.y < -dieY) {
        this.reset()
      }
    }

    step() {
      const ctx = ctxRef.current
      const opts = optsRef.current

      if (!ctx) return

      ++this.time
      ++this.cumulativeTime

      if (this.time >= this.targetTime) {
        this.beginPhase()
      }

      const prop = this.time / this.targetTime
      const wave = Math.sin((prop * Math.PI) / 2)
      const x = this.addedX * wave
      const y = this.addedY * wave

      ctx.shadowBlur = prop * opts.shadowToTimePropMult
      ctx.fillStyle = ctx.shadowColor = this.color.replace(
        "light",
        String(opts.baseLight + opts.addedLight * Math.sin(this.cumulativeTime * this.lightInputMultiplier)),
      )
      ctx.fillRect(opts.cx + (this.x + x) * opts.len, opts.cy + (this.y + y) * opts.len, 2, 2)

      if (Math.random() < opts.sparkChance) {
        ctx.fillRect(
          opts.cx +
            (this.x + x) * opts.len +
            Math.random() * opts.sparkDist * (Math.random() < 0.5 ? 1 : -1) -
            opts.sparkSize / 2,
          opts.cy +
            (this.y + y) * opts.len +
            Math.random() * opts.sparkDist * (Math.random() < 0.5 ? 1 : -1) -
            opts.sparkSize / 2,
          opts.sparkSize,
          opts.sparkSize,
        )
      }
    }
  }

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctxRef.current = ctx

    // Use container dimensions instead of window dimensions
    const w = containerWidth
    const h = containerHeight

    canvas.width = w
    canvas.height = h

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, w, h)

    optsRef.current.cx = w / 2
    optsRef.current.cy = h / 2
    dieXRef.current = w / 2 / optsRef.current.len
    dieYRef.current = h / 2 / optsRef.current.len
  }, [containerWidth, containerHeight]) // Dependencies for setupCanvas

  const loop = useCallback(() => {
    const ctx = ctxRef.current
    const opts = optsRef.current
    const lines = linesRef.current
    const tick = tickRef.current

    if (!ctx) return

    animationFrameIdRef.current = window.requestAnimationFrame(loop)

    tickRef.current = tick + 1

    ctx.globalCompositeOperation = "source-over"
    ctx.shadowBlur = 0
    ctx.fillStyle = `rgba(0,0,0,${opts.repaintAlpha})`
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.globalCompositeOperation = "lighter"

    // All lines are pre-spawned, so no need for conditional spawning here
    lines.forEach((line) => line.step())
  }, [])

  useEffect(() => {
    setupCanvas() // Initial setup with container dimensions

    // Initialize all lines at the start
    linesRef.current = [] // Clear any previous lines if component re-mounts
    for (let i = 0; i < optsRef.current.count; i++) {
      linesRef.current.push(new Line())
    }

    // Start animation loop
    animationFrameIdRef.current = window.requestAnimationFrame(loop)

    // No need for window resize listener if dimensions are passed as props
    // The component will re-render and re-setup if props change.

    // Cleanup function
    return () => {
      if (animationFrameIdRef.current) {
        window.cancelAnimationFrame(animationFrameIdRef.current)
      }
      // No window resize listener to remove
    }
  }, [setupCanvas, loop]) // Dependencies for useEffect

  return <canvas ref={canvasRef} className="w-full h-full" />
}

import { useEffect, useRef } from 'react'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const WIDTH = 400
  const HEIGHT = 400

  interface Point {
    x: number
    y: number
  }

  interface Branch {
    start: Point
    length: number
    theta: number
  }

  const init = () => {
    const canvas = canvasRef.current
    const ctx = canvas!.getContext('2d')
    ctx!.strokeStyle = 'rgba(55, 65, 81, .3)'

    const lineTo = (p1: Point, p2: Point) => {
      ctx!.beginPath()
      ctx!.moveTo(p1.x, p1.y)
      ctx!.lineTo(p2.x, p2.y)
      ctx!.stroke()
    }

    const getEndPoint = (b: Branch): Point => {
      return {
        x: b.start.x + b.length * Math.cos(b.theta),
        y: b.start.y + b.length * Math.sin(b.theta)
      }
    }

    const drawBranch = (b: Branch) => {
      lineTo(b.start, getEndPoint(b))
    }

    const pendingTasks: Function[] = []

    const step = (b: Branch, depth = 0) => {
      const end = getEndPoint(b)
      drawBranch(b)

      if (depth < 2 || Math.random() < 0.5) {
        pendingTasks.push(() =>
          step(
            {
              start: end,
              length: b.length + (Math.random() * 10 - 5),
              theta: b.theta - 0.3 * Math.random()
            },
            depth + 1
          )
        )
      }

      if (depth < 2 || Math.random() < 0.5) {
        pendingTasks.push(() =>
          step(
            {
              start: end,
              length: b.length + (Math.random() * 10 - 5),
              theta: b.theta + 0.3 * Math.random()
            },
            depth + 1
          )
        )
      }
    }

    step({
      start: { x: WIDTH * Math.random(), y: HEIGHT },
      length: 10,
      theta: -Math.PI / 2
    })

    const frame = () => {
      const tasks = [...pendingTasks]
      pendingTasks.length = 0
      tasks.forEach(fn => fn())
    }

    let framesCount = 0
    const startFrame = () => {
      requestAnimationFrame(() => {
        framesCount++
        framesCount % 3 === 0 && frame()
        startFrame()
      })
    }

    startFrame()
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        width='400'
        height='400'
        style={{ border: '1px solid' }}
      />
    </>
  )
}

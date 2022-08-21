import { useEffect, useRef } from 'react'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const WIDTH = 600
  const HEIGHT = 600

  interface Point {
    x: number
    y: number
  }

  interface Branch {
    start: Point
    length: number
    theta: number // 夹角角度
  }

  const init = () => {
    const canvas = canvasRef.current
    const ctx = canvas!.getContext('2d')
    ctx!.strokeStyle = 'rgba(55, 65, 81, .25)'

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

    const step = (b: Branch) => {
      const end = getEndPoint(b)
      drawBranch(b)

      if (Math.random() < 0.5) {
        pendingTasks.push(() =>
          step({
            start: end,
            length: b.length,
            theta: b.theta - 0.2
          })
        )
      }

      if (Math.random() < 0.5) {
        pendingTasks.push(() =>
          step({
            start: end,
            length: b.length,
            theta: b.theta + 0.2
          })
        )
      }
    }

    step({
      start: { x: WIDTH / 2, y: HEIGHT },
      length: 40,
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
        width='600'
        height='600'
        style={{ border: '1px solid' }}
      />
    </>
  )
}

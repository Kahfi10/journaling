"use client"

import { useEffect, useRef } from "react"

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      if (barRef.current) barRef.current.style.width = `${progress}%`
    }
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[2px]" style={{ background: "transparent" }}>
      <div
        ref={barRef}
        className="h-full transition-none"
        style={{ width: "0%", background: "var(--j-text-1)" }}
      />
    </div>
  )
}

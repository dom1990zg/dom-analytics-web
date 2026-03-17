'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UniversePage() {
  useEffect(() => {
    window.location.href = '/universe-game.html'
  }, [])
  return null
}
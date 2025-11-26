import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-green-200 bg-white/80 backdrop-blur">
      <div className="container mx-auto max-w-5xl px-4 py-4 text-sm flex items-center justify-between">
        <span>© {new Date().getFullYear()} AI Crop Disease Doctor — Empowering Rwandan Farmers</span>
        <div className="flex gap-4">
          <a className="hover:text-forest" href="/privacy">Privacy</a>
          <a className="hover:text-forest" href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  )
}



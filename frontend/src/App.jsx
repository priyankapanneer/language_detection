import React, { useState, useEffect } from 'react'
import InputCard from './components/InputCard'
import ResultCard from './components/ResultCard'
import HistoryList from './components/HistoryList'
import DarkToggle from './components/DarkToggle'
import { motion } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('history') || '[]') } catch { return [] }
  })
  const [latest, setLatest] = useState(history[0] || null)

  const addHistory = (item) => {
    const next = [item, ...history].slice(0,5)
    setHistory(next)
    setLatest(next[0] || null)
    localStorage.setItem('history', JSON.stringify(next))
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#071022] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">🌐</div>
            <motion.h1 initial={{y:-10, opacity:0}} animate={{y:0, opacity:1}} className="text-white text-4xl hero-title">Language Detect</motion.h1>
          </div>
          <DarkToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <InputCard apiUrl={API_URL} onResult={addHistory} />
          </div>
          <div>
            <ResultCard latest={latest} />
            <HistoryList items={history} />
          </div>
        </div>
      </div>
    </div>
  )
}

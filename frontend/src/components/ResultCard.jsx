import React from 'react'
import { motion } from 'framer-motion'

const FLAG_MAP = {
  en: '🇬🇧',
  fr: '🇫🇷',
  es: '🇪🇸',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹',
  ja: '🇯🇵',
  zh: '🇨🇳',
}

export default function ResultCard({ latest }){
  if (!latest) return (
    <motion.div initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} className="bg-white/20 backdrop-blur rounded-xl p-4 mb-4 text-white">
      <div className="font-semibold">No results yet</div>
    </motion.div>
  )

  const copy = async () => {
    try{
      await navigator.clipboard.writeText(`${latest.text}\n\n${latest.language} — ${Math.round(latest.confidence*100)}%`)
      alert('Result copied to clipboard')
    }catch(e){ alert('Copy failed') }
  }

  const flag = FLAG_MAP[latest.language] || '🏳️'

  return (
    <motion.div initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} className="glass-card backdrop-blur rounded-2xl p-4 mb-4 text-white shadow-lg">
      <div className="flex items-center gap-4">
        <div className="text-4xl">{flag}</div>
        <div className="flex-1">
          <div className="text-sm text-white/80">Detected language</div>
          <div className="text-2xl font-bold">{latest.language}</div>
          <div className="text-sm text-white/70 mt-1">{latest.text.slice(0,120)}{latest.text.length>120? '...' : ''}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/80">Confidence</div>
          <div className="text-lg font-semibold">{Math.round(latest.confidence * 100)}%</div>
          <button onClick={copy} className="mt-3 w-full bg-white/10 px-3 py-1 rounded">Copy result</button>
        </div>
      </div>
    </motion.div>
  )
}

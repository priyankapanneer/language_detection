import React from 'react'
import { motion } from 'framer-motion'

export default function HistoryList({ items = [] }){
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="glass-card backdrop-blur rounded-2xl p-4 text-white shadow-lg">
      <div className="font-semibold mb-3">Recent detections</div>
      <div className="flex flex-col gap-3">
        {items.length === 0 && <div className="text-sm text-white/70">No recent detections</div>}
        {items.map((it, i) => (
          <div key={i} className="bg-white/4 p-3 rounded-lg flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/80">{new Date(it.time).toLocaleString()}</div>
              <div className="text-sm font-semibold">{it.language} — {Math.round(it.confidence*100)}%</div>
            </div>
            <div className="text-sm text-white/90">{it.text}</div>
            <div className="flex justify-end">
              <button onClick={async ()=>{try{await navigator.clipboard.writeText(it.text); alert('Copied') }catch{alert('Copy failed')}}} className="bg-white/10 px-3 py-1 rounded text-sm">Copy</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightIcon, SparklesIcon, ClipboardIcon } from '@heroicons/react/24/outline'

export default function InputCard({ apiUrl, onResult }){
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  async function handleDetect(){
    if (!text.trim()) return alert('Please enter some text')
    setLoading(true)
    try{
      const res = await fetch(`${apiUrl}/predict`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({text})
      })
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || 'API error')
      }
      const data = await res.json()
      setResult(data)
      onResult({ text, ...data, time: Date.now() })
    }catch(err){
      // nicer in-UI error handling
      setResult({ error: err.message })
    }finally{ setLoading(false) }
  }

  const examples = [
    'Hello, how are you?',
    'Bonjour tout le monde',
    '¿Dónde está la biblioteca?'
  ]

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="glass-card backdrop-blur rounded-2xl p-6 shadow-xl">
      <label className="text-white font-semibold mb-2 block">Enter text</label>
      <div className="flex gap-3 mb-4">
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Type or paste text here to detect language..." rows={6}
          className="w-full p-4 rounded-xl bg-transparent placeholder-white/70 text-white border border-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {examples.map((ex)=> (
            <button key={ex} onClick={()=>setText(ex)} className="text-sm text-white/90 bg-white/5 px-3 py-1 rounded hover:bg-white/10 transition">{ex}</button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={handleDetect} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {loading ? 'Detecting...' : 'Detect Language'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

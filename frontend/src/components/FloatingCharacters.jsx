import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

const CHARS = ['A', 'あ', 'Ω', 'ç', 'Ж', '文', 'ñ', '@', 'µ', '§', 'æ', '汉', 'क', 'ي', '가', 'ß', 'λ', 'ש']

export default function FloatingCharacters() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 1.5 + 0.5}rem`,
      duration: Math.random() * 20 + 20, // 20s to 40s
      delay: Math.random() * -20 // random start time
    }))
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: '110vh', opacity: 0, rotate: 0 }}
          animate={{ y: '-10vh', opacity: [0, 0.15, 0.4, 0.15, 0], rotate: 360 }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            left: p.left,
            fontSize: p.size,
            color: 'rgba(255, 255, 255, 0.4)',
            textShadow: '0 0 10px rgba(124, 58, 237, 0.5)',
            fontWeight: 800,
            userSelect: 'none'
          }}
        >
          {p.char}
        </motion.div>
      ))}
    </div>
  )
}

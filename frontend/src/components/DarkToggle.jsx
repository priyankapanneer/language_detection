import React, { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

export default function DarkToggle(){
  const [dark, setDark] = useState(() => localStorage.getItem('dark')==='1')
  useEffect(()=>{
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('dark', dark ? '1' : '0')
  }, [dark])
  return (
    <button onClick={()=>setDark(d=>!d)} className="bg-white/6 text-white px-3 py-2 rounded-full flex items-center gap-2 hover:scale-105 transition">
      {dark ? <SunIcon className="w-5 h-5 text-yellow-300"/> : <MoonIcon className="w-5 h-5 text-indigo-300"/>}
    </button>
  )
}

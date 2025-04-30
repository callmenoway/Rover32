"use client"

import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

//? Hook personalizzato per gestire il tema dell'applicazione
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')
  
  //! Questo effetto viene eseguito solo al montaggio del componente
  useEffect(() => {
    // Recupera il tema dal localStorage all'avvio
    const savedTheme = localStorage.getItem('theme') as Theme

    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }
  }, [])

  //? Funzione per alternare il tema tra chiaro e scuro
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)

    // Salva il tema nel localStorage
    localStorage.setItem('theme', newTheme)

    // Aggiorna la classe sul documento
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return { theme, toggleTheme }
}

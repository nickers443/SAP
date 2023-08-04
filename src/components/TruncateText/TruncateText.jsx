import React from 'react'
import './TruncateText.style.scss'

export default function TruncateText({ text, maxWords }) {
  if (typeof text === 'undefined') return

  const words = text.trim().split(' ')
  const truncatedText = words.slice(0, maxWords).join(' ')

  return (
    <div>
      {truncatedText}
      {words.length > maxWords && '...'}
    </div>
  )
}

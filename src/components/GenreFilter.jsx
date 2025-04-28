import React from 'react'
import './GenreFilter.css'

const OPTIONS = [ 'Rock','Pop','Hip-Hop','Jazz','Classical','Electronic','Country','Reggae','Metal','R&B', 'Folk','Blues','Punk','Indie','Alternative','Afrobeat','Latin','K-Pop','Soundtrack','Gospel','Instrumental','Experimental','Other'] 

export default function GenreFilter({ genres, onChange }) {
  const toggle = (g) =>
    onChange(genres.includes(g)
      ? genres.filter(x => x !== g)
      : [...genres, g])

  return (
    <div className="genre-pills">
      {OPTIONS.map((g) => (
        <button
          key={g}
          type="button"
          className={genres.includes(g) ? 'pill selected' : 'pill'}
          onClick={() => toggle(g)}
        >
          {g}
        </button>
      ))}
    </div>
  )
}

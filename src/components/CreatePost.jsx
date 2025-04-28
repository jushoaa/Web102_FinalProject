import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './CreatePost.css'

const GENRE_OPTIONS = [
  'Rock',
  'Pop',
  'Hip-Hop',
  'Jazz',
  'Classical',
  'Electronic',
  'Country',
  'Reggae',
  'Metal',
  'R&B',
  'Folk',
  'Blues',
  'Punk',
  'Indie',
  'Alternative',
  'Afrobeat',
  'Latin',
  'K-Pop',
  'Soundtrack',
  'Gospel',
  'Instrumental',
  'Experimental',
  'Other'
]

export default function CreatePost() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [genres, setGenres] = useState([])
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenreChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (opt) => opt.value
    )
    setGenres(selected)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // insert and return the new row
    const { data, error: supaErr } = await supabase
      .from('Music_posts')
      .insert(
        {
          title,
          artist,
          audio_url: audioUrl,
          Genre: genres,       
          description
        },
        { returning: 'representation' }
      )
      .single()

    if (supaErr) {
      console.error('Error creating post:', supaErr)
      setError('Failed to create post.')
      setLoading(false)
    } else {
      // redirect to the feed page
      navigate(`/feed`)
    }
  }

  return (
    <div className="create-post">
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <label>
          Song Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Artist
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </label>

        <label>
          Spotify Link
          <input
            type="text"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            required
          />
        </label>

        <label>
          Genre(s)
          <select
            multiple
            value={genres}
            onChange={handleGenreChange}
          >
            {GENRE_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}

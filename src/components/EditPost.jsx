import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './EditPost.css'

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
  'R&B'
]

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [genres, setGenres] = useState([])
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadPost() {
      setLoading(true)
      const { data, error } = await supabase
        .from('Music_posts')
        .select('title, artist, audio_url, Genre, description')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error loading post:', error)
        setError('Error loading post.')
      } else {
        setTitle(data.title)
        setArtist(data.artist)
        setAudioUrl(data.audio_url)
        setGenres(data.Genre || [])
        setDescription(data.description || '')
      }
      setLoading(false)
    }
    loadPost()
  }, [id])

  const handleGenreChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (opt) => opt.value
    )
    setGenres(selected)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { error: supaErr } = await supabase
      .from('Music_posts')
      .update({
        title,
        artist,
        audio_url: audioUrl,
        Genre: genres,
        description
      })
      .eq('id', id)
      .single()

    if (supaErr) {
      console.error('Error updating post:', supaErr)
      setError('Failed to update post.')
      setSaving(false)
    } else {
      navigate(`/posts/${id}`)
    }
  }

  if (loading) {
    return (
      <div className="edit-post">
        <p>Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="edit-post">
        <p className="error">{error}</p>
      </div>
    )
  }

  return (
    <div className="edit-post">
      <Link to={`/posts/${id}`} className="back-link">
        ← Back to Post
      </Link>
      <h1>Edit Post</h1>
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
          Audio URL
          <input
            type="text"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            required
          />
        </label>

        <label>
          Genre(s)
          <select multiple value={genres} onChange={handleGenreChange}>
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

        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

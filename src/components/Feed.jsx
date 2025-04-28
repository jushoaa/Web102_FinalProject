import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import PostCard from './PostCard'
import SearchBar from './SearchBar'
import SortFeed from './SortFeed'
import GenreFilter from './GenreFilter'
import './Feed.css'

export default function Feed() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [selectedGenres, setSelectedGenres] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadPosts() {
      setLoading(true)
      let query = supabase.from('Music_posts').select('*')

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`)
      }
      if (selectedGenres.length > 0) {
        // filters posts whose Genre array contains all selected genres
        query = query.contains('Genre', selectedGenres)
      }

      const { data, error } = await query.order(sortBy, { ascending: false })

      if (error) {
        console.error('Error fetching posts:', error)
        setError('Failed to load posts.')
      } else {
        setPosts(data)
      }
      setLoading(false)
    }

    loadPosts()
  }, [searchTerm, sortBy, selectedGenres])

  if (loading) {
    return (
      <div className="feed">
        <p>Loading posts…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="feed">
        <p className="error">{error}</p>
      </div>
    )
  }

  return (


    <div className="feed">
        <p>Discover and share your favorite music!</p>
        <p>Explore posts, create your own, and connect with music lovers.</p>
      <div className="feed-controls">
        <Link to="/create" className="create-link">
          + Create Post
        </Link>
        <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
        <SortFeed sortBy={sortBy} onSortChange={setSortBy} />
        <GenreFilter genres={selectedGenres} onChange={setSelectedGenres} />
      </div>

      {posts.length === 0 ? (
        <p>
          No posts yet. Be the first to <Link to="/create">create one</Link>!
        </p>
      ) : (
        <div className="feed-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

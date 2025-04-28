import React from 'react'
import { Link } from 'react-router-dom'
import './PostCard.css'

export default function PostCard({ post }) {
  const date = new Date(post.created_at).toLocaleString()
  return (
    <Link to={`/posts/${post.id}`} className="post-card">
      <div className="post-info">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-artist">{post.artist}</p>
      </div>
      <div className="post-meta">
        <span className="post-upvotes">🔼 {post.upvotes}</span>
        <span className="post-date">{date}</span>
      </div>
    </Link>
  )
}

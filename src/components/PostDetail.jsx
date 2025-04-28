import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import CommentList from './CommentList'
import { toSpotifyEmbed } from '../utils/spotify'
import './PostDetail.css'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentError, setCommentError] = useState(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const { data: postData, error: postError } = await supabase
        .from('Music_posts')
        .select('*')
        .eq('id', id)
        .single()
      if (postError) {
        setError('Error loading post.')
        setLoading(false)
        return
      }
      setPost(postData)

      const { data: commentData, error: commentErr } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true })
      if (commentErr) {
        setError('Error loading comments.')
      } else {
        setComments(commentData)
      }
      setLoading(false)
    }
    loadData()
  }, [id])

  const handleUpvotePost = async () => {
    const { data, error: upvoteErr } = await supabase
      .from('Music_posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id)
      .select()
      .single()
    if (upvoteErr) {
      console.error('Error upvoting post:', upvoteErr)
    } else {
      setPost(data)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setCommentLoading(true)
    setCommentError(null)
    const { data, error: insertErr } = await supabase
      .from('comments')
      .insert({ post_id: id, comment: newComment, upvotes: 0 })
      .select()
      .single()
    if (insertErr) {
      console.error('Error adding comment:', insertErr)
      setCommentError('Failed to add comment.')
    } else {
      setComments((prev) => [...prev, data])
      setNewComment('')
    }
    setCommentLoading(false)
  }

  const handleUpvoteComment = async (commentId) => {
    const comment = comments.find((c) => c.id === commentId)
    const { data, error: upvoteErr } = await supabase
      .from('comments')
      .update({ upvotes: comment.upvotes + 1 })
      .eq('id', commentId)
      .select()
      .single()
    if (upvoteErr) {
      console.error('Error upvoting comment:', upvoteErr)
    } else {
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? data : c))
      )
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    const { error: deleteErr } = await supabase
      .from('Music_posts')
      .delete()
      .eq('id', id)
    if (deleteErr) {
      console.error('Error deleting post:', deleteErr)
      setError('Failed to delete post.')
    } else {
      navigate('/')
    }
  }

  if (loading) return <div className="post-detail">Loading…</div>
  if (error) return <div className="post-detail"><p className="error">{error}</p></div>
  if (!post)  return <div className="post-detail"><p className="error">Post not found.</p></div>

  return (
    <div className="post-detail">
      <Link to="/" className="back-link">← Back to Feed</Link>

      <div className="post-detail-actions">
        <Link to={`/posts/${id}/edit`} className="edit-btn">
          ✏️ Edit Post
        </Link>
        <button onClick={handleDelete} className="delete-btn">
          🗑️ Delete Post
        </button>
      </div>

      <h1 className="post-title">{post.title}</h1>
      <p className="post-artist">{post.artist}</p>

      {post.Genre?.length > 0 && (
        <div className="post-genres">
          {post.Genre.map((g) => (
            <span key={g} className="genre-tag">{g}</span>
          ))}
        </div>
      )}

      <div className="audio-embed">
        <iframe
          src={toSpotifyEmbed(post.audio_url)}
          width="100%"
          height="80"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="audio-player"
        />
      </div>

      <p className="post-description">{post.description}</p>

      <div className="post-actions">
        <button onClick={handleUpvotePost} className="upvote-btn">
          🔼 Upvote ({post.upvotes})
        </button>
      </div>

      <section className="comments-section">
        <h2>Comments</h2>
        {comments.length === 0
          ? <p>No comments yet.</p>
          : <CommentList comments={comments} onUpvote={handleUpvoteComment} />
        }

        <form onSubmit={handleSubmitComment} className="comment-form">
          {commentError && <p className="error">{commentError}</p>}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button type="submit" disabled={commentLoading}>
            {commentLoading ? 'Posting…' : 'Post Comment'}
          </button>
        </form>
      </section>
    </div>
  )
}

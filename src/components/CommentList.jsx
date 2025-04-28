import React from 'react'
import './CommentList.css'

export default function CommentList({ comments, onUpvote }) {
  return (
    <ul className="comment-list">
      {comments.map((c) => (
        <li key={c.id} className="comment-card">
          <p className="comment-text">{c.comment}</p>
          <div className="comment-meta">
            <span className="comment-date">
              {new Date(c.created_at).toLocaleString()}
            </span>
            <button
              onClick={() => onUpvote(c.id)}
              className="comment-upvote-btn"
            >
              🔼 {c.upvotes}
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

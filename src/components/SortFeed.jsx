import React from 'react'
import './SortFeed.css'

export default function SortFeed({ sortBy, onSortChange }) {
  return (
    <select
      className="sort-feed"
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value)}
    >
      <option value="created_at">Newest</option>
      <option value="upvotes">Most Upvoted</option>
    </select>
  )
}

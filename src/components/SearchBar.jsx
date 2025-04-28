import React from 'react'
import './SearchBar.css'

export default function SearchBar({ searchTerm, onSearch }) {
  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Search by title…"
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
    />
  )
}
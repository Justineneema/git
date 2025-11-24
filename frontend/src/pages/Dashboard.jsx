import React, { useEffect, useState } from 'react'
import { api } from '../api/axios.js'
import { Link } from 'react-router-dom'

export default function Dashboard({ auth }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    // Wait until access token is present to avoid initial 401
    if (!auth?.user?.access) {
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const { data } = await api.get('history/')
        if (mounted) setItems(data)
      } catch (e) {
        console.error('Failed to load detection history:', e)
        setError('Failed to load detection history')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [auth?.user?.access])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-forest">Your Detection History</h2>
        <Link to="/upload" className="btn-primary">New Detection</Link>
      </div>
      
      {loading && (
        <div className="card text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your detections...</p>
        </div>
      )}
      
      {error && (
        <div className="card text-red-600 bg-red-50 border-red-200">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm underline"
          >
            Try Again
          </button>
        </div>
      )}
      
      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 && (
            <div className="card text-center py-8 md:col-span-2 lg:col-span-3">
              <p className="text-gray-600 mb-4">No detections yet.</p>
              <Link to="/upload" className="btn-primary">Start Your First Detection</Link>
            </div>
          )}
          {items.map((d) => (
            <div key={d.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium text-lg text-forest">
                    {d.predicted_disease?.name || 'Unknown Disease'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {d.predicted_disease?.species || 'Crop'}
                  </p>
                </div>
                <span className="bg-forest text-white px-2 py-1 rounded text-sm font-semibold">
                  {Math.round((d.confidence || 0) * 100)}%
                </span>
              </div>
              
              {d.image && (
                <div className="mb-3">
                  <img 
                    src={d.image} 
                    alt="Detection" 
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}
              
              <div className="text-xs text-gray-500 border-t pt-2">
                Detected: {new Date(d.created_at || d.detected_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

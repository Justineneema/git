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
        const { data } = await api.get('detections/')
        if (mounted) setItems(data)
      } catch (e) {
        setError('Failed to load detections')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [auth?.user?.access])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-forest">Your Detections</h2>
        <Link to="/upload" className="btn-primary">New Detection</Link>
      </div>
      {loading && <div className="card">Loading...</div>}
      {error && <div className="card text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2">
          {items.length === 0 && (
            <div className="card">No detections yet. Start by uploading an image.</div>
          )}
          {items.map((d)=> (
            <div key={d.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{d.predicted_disease?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">{d.predicted_disease?.species}</p>
                </div>
                <span className="text-forest font-semibold">{Math.round((d.confidence || 0)*100)}%</span>
              </div>
              <p className="text-sm mt-2">{new Date(d.detected_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



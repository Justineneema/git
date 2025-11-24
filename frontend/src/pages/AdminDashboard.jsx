import React, { useEffect, useState } from 'react'
import { api } from '../api/axios.js'

export default function AdminDashboard({ auth }) {
  const [detections, setDetections] = useState([])
  const [diseases, setDiseases] = useState([])
  const [form, setForm] = useState({ 
    name: '', 
    species: '', 
    description: '', 
    treatment: '',
    care_tips: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const canAccess = auth.user?.user?.is_expert || auth.user?.user?.is_staff

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [dhist, ddise] = await Promise.all([
          api.get('history/'),
          api.get('diseases/'),
        ])
        if (mounted) {
          setDetections(dhist.data)
          setDiseases(ddise.data)
        }
      } catch (e) {
        console.error('Failed to load admin data:', e)
        setError('Failed to load admin data')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [auth])

  const submitDisease = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      const { data } = await api.post('diseases/', form)
      setDiseases((prev) => [data, ...prev])
      setForm({ 
        name: '', 
        species: '', 
        description: '', 
        treatment: '',
        care_tips: '' 
      })
      setSuccess('Disease added successfully!')
    } catch (e) {
      console.error('Failed to add disease:', e)
      setError('Failed to add disease. Please try again.')
    }
  }

  if (!canAccess) {
    return (
      <div className="card text-center py-8">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to access admin features.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-forest">Admin Dashboard</h2>
        <div className="text-sm text-gray-600">
          Welcome, {auth.user?.user?.username}
        </div>
      </div>
      
      {loading && (
        <div className="card text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading admin data...</p>
        </div>
      )}
      
      {error && (
        <div className="card text-red-600 bg-red-50 border-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="card text-green-700 bg-green-50 border-green-200">
          {success}
        </div>
      )}

      <section className="card">
        <h3 className="text-lg font-semibold mb-4">Add New Disease</h3>
        <form onSubmit={submitDisease} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input 
              className="input" 
              placeholder="Disease Name" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              required 
            />
            <input 
              className="input" 
              placeholder="Affected Species" 
              value={form.species} 
              onChange={e => setForm({...form, species: e.target.value})} 
              required 
            />
          </div>
          <textarea 
            className="input" 
            rows={3} 
            placeholder="Description" 
            value={form.description} 
            onChange={e => setForm({...form, description: e.target.value})} 
            required
          />
          <textarea 
            className="input" 
            rows={3} 
            placeholder="Treatment" 
            value={form.treatment} 
            onChange={e => setForm({...form, treatment: e.target.value})} 
            required
          />
          <textarea 
            className="input" 
            rows={2} 
            placeholder="Care Tips" 
            value={form.care_tips} 
            onChange={e => setForm({...form, care_tips: e.target.value})} 
          />
          <div>
            <button type="submit" className="btn-primary">
              Add Disease
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Existing Diseases ({diseases.length})</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {diseases.map((d) => (
              <div key={d.id} className="border rounded p-3 bg-white">
                <div className="font-medium text-forest">{d.name} 
                  <span className="text-sm text-gray-600 ml-2">({d.species})</span>
                </div>
                <div className="text-sm text-gray-700 mt-1">{d.description}</div>
                <div className="text-xs text-gray-500 mt-2">
                  <strong>Treatment:</strong> {d.treatment}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold mb-4">
          All User Detections ({detections.length})
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {detections.map((x) => (
            <div key={x.id} className="border rounded p-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-forest">
                    {x.predicted_disease?.name || 'Unknown Disease'}
                  </div>
                  <div className="text-sm text-gray-600">
                    User: {x.user?.username} • Confidence: {Math.round((x.confidence || 0) * 100)}%
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(x.created_at || x.detected_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

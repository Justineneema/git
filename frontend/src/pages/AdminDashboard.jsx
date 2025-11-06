import React, { useEffect, useState } from 'react'
import { api } from '../api/axios.js'

export default function AdminDashboard({ auth }) {
  const [detections, setDetections] = useState([])
  const [diseases, setDiseases] = useState([])
  const [form, setForm] = useState({ name: '', species: '', description: '', treatment: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const canAccess = auth.user?.user?.is_expert || auth.user?.user?.is_staff

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [dhist, ddise] = await Promise.all([
          api.get('detections/'),
          api.get('diseases/'),
        ])
        if (mounted) {
          setDetections(dhist.data)
          setDiseases(ddise.data)
        }
      } catch (e) {
        setError('Failed to load admin data')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const submitDisease = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('diseases/', form)
      setDiseases((prev)=> [data, ...prev])
      setForm({ name: '', species: '', description: '', treatment: '' })
    } catch (e) {
      setError('Failed to add disease')
    }
  }

  if (!canAccess) return <div className="card">You do not have access to admin features.</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-forest">Admin Dashboard</h2>
      {loading && <div className="card">Loading...</div>}
      {error && <div className="card text-red-600">{error}</div>}

      <section className="card">
        <h3 className="text-lg font-semibold">Add/Update Disease</h3>
        <form onSubmit={submitDisease} className="mt-3 grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
          <input className="input" placeholder="Species" value={form.species} onChange={e=>setForm({...form, species: e.target.value})} required />
          <textarea className="input md:col-span-2" rows={3} placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
          <textarea className="input md:col-span-2" rows={3} placeholder="Treatment" value={form.treatment} onChange={e=>setForm({...form, treatment: e.target.value})} />
          <div className="md:col-span-2">
            <button className="btn-primary">Save Disease</button>
          </div>
        </form>
        <div className="mt-4 grid gap-3">
          {diseases.map((d)=> (
            <div key={d.id} className="border rounded p-3">
              <div className="font-medium">{d.name} <span className="text-sm text-gray-600">({d.species})</span></div>
              <div className="text-sm mt-1">{d.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">All Detections</h3>
        <div className="mt-3 grid gap-3">
          {detections.map((x)=> (
            <div key={x.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{x.predicted_disease?.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-600">{x.user?.username}</div>
                </div>
                <div className="text-forest font-semibold">{Math.round((x.confidence || 0)*100)}%</div>
              </div>
              <div className="text-sm mt-1">{new Date(x.detected_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}



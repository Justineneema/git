// DEBUG VERSION - Add this temporary diagnostic to understand the flow

import React, { useEffect, useRef, useState } from 'react'
import { api } from '../api/axios.js'
import ResultCard from '../components/ResultCard.jsx'

export default function UploadImage() {
  const [file, setFile] = useState(null)
  const [useCamera, setUseCamera] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [debugInfo, setDebugInfo] = useState('') // NEW: Debug info display

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    setDebugInfo('') // NEW: Clear debug info

    try {
      const form = new FormData()
      form.append('image', file)
      
      console.log('Sending image to backend...')
      setDebugInfo(' Sending to backend...')
      
      const response = await api.post('ai-detect/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      console.log('Full response object:', response)
      console.log('Response keys:', Object.keys(response))
      
      const { data, status } = response
      
      console.log(' Status:', status)
      console.log(' Data:', data)
      console.log(' Data keys:', Object.keys(data || {}))
      
      setDebugInfo(`Status: ${status}, Has error field: ${'error' in (data || {})}`)
      
      // Check if detection was successful
      if (data?.error) {
        console.log(' Backend error found:', data.error)
        setError(data.error)
        setDebugInfo(`Error detected: ${data.error}`)
      } else if (data?.status === 'success' && data?.predicted_disease) {
        console.log(' Detection successful')
        setResult(data)
        setDebugInfo('Detection successful')
      } else {
        console.log(' Unexpected response structure')
        setDebugInfo(`Unexpected response: ${JSON.stringify(data).substring(0, 100)}`)
        setError('Unexpected response from server')
      }
    } catch (e) {
      console.error(' Catch block triggered')
      console.error('Error object:', e)
      console.error('Error response:', e?.response)
      console.error('Error response data:', e?.response?.data)
      
      const msg = e?.response?.data?.error || e?.message || 'Detection failed'
      setError(msg)
      setDebugInfo(`Caught error: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold text-forest">Upload or Capture Crop Image (DEBUG)</h2>
        
        {/* DEBUG INFO BOX */}
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-700 font-mono">{debugInfo || 'Ready...'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="text-sm text-gray-600">Select a WRONG/INVALID file to test error handling</div>
          </div>

          <div>
            <div className="space-y-3">
              {file && (
                <img className="rounded-lg object-cover w-full max-h-64 border" src={URL.createObjectURL(file)} alt="Preview" />
              )}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-700 text-sm font-medium"> {error}</p>
                </div>
              )}
              <button className="btn-primary" disabled={loading || !file}>
                {loading ? 'Detecting...' : 'Run Detection'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {result && (
        <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="font-bold text-lg mb-2 text-forest">Detection Result</h3>
          <ResultCard result={result} />
        </div>
      )}
    </div>
  )
}

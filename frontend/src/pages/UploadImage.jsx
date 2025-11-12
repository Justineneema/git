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
  const [translated, setTranslated] = useState(null)

  // camera activation
  useEffect(() => {
    let stream
    const start = async () => {
      if (!useCamera) return
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (e) {
        setError('Camera access denied')
        setUseCamera(false)
      }
    }
    start()
    return () => { if (stream) stream.getTracks().forEach(t=>t.stop()) }
  }, [useCamera])

  const capturePhoto = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    const blob = await new Promise(res=> canvas.toBlob(res, 'image/jpeg', 0.9))
    setFile(new File([blob], 'capture.jpg', { type: 'image/jpeg' }))
    setUseCamera(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    setTranslated(null)

    try {
      const form = new FormData()
      form.append('image', file)
      const { data } = await api.post('ai-detect/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(data)

      // Combine disease + treatment + analysis text to translate
      const fullText = `
        Disease: ${data.disease || 'Unknown'}
        Treatment: ${data.treatment || ''}
        Analysis: ${data.analysis || ''}
      `
      const translationRes = await api.post('translate/', { text: fullText, target_lang: 'rw' })
      setTranslated(translationRes.data.translated_text)
    } catch (e) {
      const msg = e?.response?.data?.error || 'Detection failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold text-forest">Upload or Capture Crop Image</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <input type="file" accept="image/*" onChange={(e)=> setFile(e.target.files?.[0] || null)} />
            <div className="text-sm text-gray-600">or</div>
            {!useCamera && (
              <button className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50" type="button" onClick={()=> setUseCamera(true)}>Open Camera</button>
            )}
            {useCamera && (
              <div className="space-y-2">
                <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg border" />
                <div className="flex gap-2">
                  <button type="button" className="btn-primary" onClick={capturePhoto}>Capture</button>
                  <button type="button" className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50" onClick={()=> setUseCamera(false)}>Close</button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </div>

          <div>
            <div className="space-y-3">
              {file && (
                <img className="rounded-lg object-cover w-full max-h-64 border" src={URL.createObjectURL(file)} alt="Preview" />
              )}
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button className="btn-primary" disabled={loading || !file}>
                {loading ? 'Detecting...' : 'Run Detection'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {result && (
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-forest">English Result</h3>
            <ResultCard result={result} />
          </div>
        )}
        {translated && (
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-forest">Ibisubizo mu Kinyarwanda</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{translated}</p>
          </div>
        )}
      </div>
    </div>
  )
}

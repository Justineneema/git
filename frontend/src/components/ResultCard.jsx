import React from 'react'

export default function ResultCard({ result }) {
  if (!result) return null
  const name = result?.predicted_disease?.name || 'Unknown'
  const species = result?.crop_name || result?.predicted_disease?.species || 'N/A'
  const confidence = result?.confidence != null ? (result.confidence * 100).toFixed(0) + '%' : 'N/A'
  const recommendation = result?.recommendation || result?.predicted_disease?.treatment || 'No recommendation'
  const healthy = result?.healthy_example
  const tips = (result?.care_tips || '').split(/\n|\.\s/).filter(Boolean)

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-forest">Detection Report</h3>
      <div className="mt-3 grid gap-6 md:grid-cols-2 items-start">
        <img className="rounded-lg object-cover w-full max-h-72" src={healthy || 'https://images.unsplash.com/photo-1607196423441-5e7b22b0b4d5?q=80&w=1200&auto=format&fit=crop'} alt="Farmer and healthy crop" />
        <div className="space-y-2">
          <p><span className="font-medium">Disease:</span> {name}</p>
          <p><span className="font-medium">Crop:</span> {species}</p>
          <p><span className="font-medium">Confidence:</span> {confidence}</p>
          <p className="mt-2"><span className="font-medium">Recommendation:</span> {recommendation}</p>
          {tips.length > 0 && (
            <div className="mt-3">
              <div className="font-medium text-forest">Care tips</div>
              <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                {tips.map((t,i)=> <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



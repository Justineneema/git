import React, { useState } from 'react';
import healthyimage from '../assets/Healthy.jpeg';
import { translateToKinyarwanda } from '../assets/kinyarwanda.js';

export default function ResultCard({ result }) {
  const [showKinyarwanda, setShowKinyarwanda] = useState(false)
  if (!result) return null

  const name = result?.predicted_disease?.name || 'Unknown'
  const species = result?.crop_name || result?.predicted_disease?.species || 'N/A'
  const confidence = result?.confidence != null ? (result.confidence * 100).toFixed(0) + '%' : 'N/A'
  const recommendation = result?.recommendation || result?.predicted_disease?.treatment || 'No recommendation'
  const healthy = result?.healthy_example
  const tips = (result?.care_tips || '').split(/\n|\.\s/).filter(Boolean)
  const translation = result?.translation || {}

  // Example usage for Kinyarwanda translation:
  const kinyarwandaName = translateToKinyarwanda(result?.predicted_disease?.name);
  const kinyarwandaDescription = translateToKinyarwanda(result?.predicted_disease?.description);
  const kinyarwandaTreatment = translateToKinyarwanda(result?.predicted_disease?.treatment);
  const kinyarwandaCareTips = translateToKinyarwanda(result?.predicted_disease?.care_tips);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-forest">Detection Report</h3>
        <button
          onClick={() => setShowKinyarwanda(!showKinyarwanda)}
          className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
        >
          {showKinyarwanda ? 'Show English 🇬🇧' : 'Show Kinyarwanda 🇷🇼'}
        </button>
      </div>

      <div className="mt-3 grid gap-6 md:grid-cols-2 items-start">
        <img
          className="rounded-lg object-cover w-full max-h-72"
          src={healthyimage}
          alt="Healthy crop"
        />
        <div className="space-y-2">
          {!showKinyarwanda ? (
            <>
              <p><span className="font-medium">Disease:</span> {name}</p>
              <p><span className="font-medium">Crop:</span> {species}</p>
              <p><span className="font-medium">Confidence:</span> {confidence}</p>
              <p className="mt-2"><span className="font-medium">Recommendation:</span> {recommendation}</p>
              {tips.length > 0 && (
                <div className="mt-3">
                  <div className="font-medium text-forest">Care Tips</div>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                    {tips.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <p><span className="font-medium">Indwara:</span> {translation.name_rw || 'Ntibisobanuye'}</p>
              <p><span className="font-medium">Igihingwa:</span> {species}</p>
              <p><span className="font-medium">Icyizere:</span> {confidence}</p>
              <p className="mt-2"><span className="font-medium">Inama y’Ubuvuzi:</span> {translation.treatment_rw || 'Nta nama ihari'}</p>
              {translation.care_tips_rw && (
                <div className="mt-3">
                  <div className="font-medium text-forest">Inama z'Itabwaho</div>
                  <p className="text-sm text-gray-700 mt-1">{translation.care_tips_rw}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
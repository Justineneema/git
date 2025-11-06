import React from 'react'

export default function Privacy() {
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-2xl font-semibold text-forest">Privacy Policy</h2>
        <p className="text-gray-700 mt-2">We collect account details you provide (username), uploaded images for disease detection, and basic usage logs to improve service quality. Images are used solely to provide diagnoses and to improve our detection models; we do not sell personal data.</p>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
          <li>Data usage: diagnosis, service improvement, security.</li>
          <li>Storage: images and results stored in our database; you may request deletion.</li>
          <li>Security: transport over HTTPS; access restricted to authorized staff.</li>
          <li>Consent: by using the app, you consent to this policy.</li>
        </ul>
      </div>
    </div>
  )
}






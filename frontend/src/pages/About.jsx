import React from 'react'

export default function About() {
  return (
    <div className="space-y-6">
      <section className="card">
        <h2 className="text-2xl font-semibold text-forest">About the Project</h2>
        <p className="mt-2 text-gray-700">We are building a practical, locally-relevant crop health assistant for Rwanda. Using AI, farmers can capture a photo and receive a diagnosis with treatment advice and links to local support.</p>
      </section>
      <section className="card">
        <h3 className="text-lg font-semibold text-forest">Problem Statement</h3>
        <p className="mt-2 text-gray-700">Smallholder farmers often lack timely access to extension officers and reliable tools to identify plant diseases. Diseases like banana bacterial wilt, maize leaf blight, and potato late blight spread quickly, causing losses that threaten livelihoods and food security.</p>
      </section>
      <section className="card">
        <h3 className="text-lg font-semibold text-forest">Solution</h3>
        <ul className="mt-2 list-disc list-inside text-gray-700 space-y-1">
          <li>Instant AI diagnosis from a simple phone photo</li>
          <li>Actionable guidance (organic, chemical, cultural) with safety notes</li>
          <li>Human validation by experts; continuous learning from feedback</li>
          <li>Local expert and agro-dealer information for on-field support</li>
        </ul>
      </section>
      <section className="card">
        <h3 className="text-lg font-semibold text-forest">Mission</h3>
        <p className="mt-2 text-gray-700">Empower Rwandan farmers with timely, accurate, and accessible crop health information through technology, strengthening productivity and food security.</p>
      </section>
    </div>
  )
}



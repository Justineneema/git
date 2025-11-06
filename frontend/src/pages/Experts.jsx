import React from 'react'

const experts = [
  { name: 'Alice Uwase', district: 'Kigali', phone: '+250 700 000 001', bio: 'Agronomist with 8 years in banana disease management and farmer training.', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop' },
  { name: 'Jean Bosco', district: 'Musanze', phone: '+250 700 000 002', bio: 'Maize pathology specialist focusing on leaf blight prevention and control.', img: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=600&auto=format&fit=crop' },
  { name: 'Divine Mukamana', district: 'Huye', phone: '+250 700 000 003', bio: 'Potato extension officer supporting late blight monitoring and best practices.', img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=600&auto=format&fit=crop' },
]

export default function Experts() {
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-2xl font-semibold text-forest">Local Experts</h2>
        <p className="text-gray-700 mt-1">Profiles of agronomists who validate AI results and support farmers in the field.</p>
      </div>
      {experts.map((e)=> (
        <div key={e.phone} className="card">
          <div className="md:flex items-start gap-4">
            <img src={e.img} alt={e.name} className="w-full md:w-60 h-48 object-cover rounded" />
            <div className="mt-3 md:mt-0">
              <div className="text-xl font-semibold">{e.name}</div>
              <div className="text-sm text-gray-700">{e.district} • {e.phone}</div>
              <p className="text-gray-700 mt-2">{e.bio} Their work involves field diagnostics, farmer trainings, and continuous refinement of best practices for local conditions. Achievements include successful campaigns reducing blight incidence by over 30%. They openly document failures (e.g., late-season outbreaks during unexpected rains) and share lessons to improve prevention.</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}



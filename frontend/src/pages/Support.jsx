import React from 'react';
import growcrop from '../assets/Geern-grow.jpeg';

const dealers = [
  { name: 'GreenGrow Agro', district: 'Rubavu', phone: '+250 788 111 222', img: growcrop, bio: 'Certified agro-dealer supplying seeds and crop protection with farmer training.' },
  { name: 'Harvest Hub', district: 'Huye', phone: '+250 788 333 444', img: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=600&auto=format&fit=crop', bio: 'Local input shop focused on eco-friendly solutions and timely delivery.' },
  { name: 'AgriPlus', district: 'Rwamagana', phone: '+250 788 555 666', img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=600&auto=format&fit=crop', bio: 'Community partner providing extension linkages and soil testing support.' },
]

export default function Support() {
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-2xl font-semibold text-forest">Local Agro-Dealers</h2>
        <p className="text-gray-700 mt-1">Trusted partners providing inputs and community support. Full bios below.</p>
      </div>
      {dealers.map((d)=> (
        <div key={d.phone} className="card">
          <div className="md:flex items-start gap-4">
            <img src={d.img} alt={d.name} className="w-full md:w-60 h-48 object-cover rounded" />
            <div className="mt-3 md:mt-0">
              <div className="text-xl font-semibold">{d.name}</div>
              <div className="text-sm text-gray-700">{d.district} • {d.phone}</div>
              <p className="text-gray-700 mt-2">{d.bio} They maintain stock quality, advise on safe use of inputs, and coordinate with extension offices during outbreaks. Achievements include organizing seasonal clinics and waste-chemical takeback programs.</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}



import React from 'react'
import { useParams } from 'react-router-dom'

export default function Certificate(){
  const { id } = useParams()
  const certs = JSON.parse(localStorage.getItem('certificates') || '[]')
  const cert = certs.find(c => String(c.id) === id)
  if(!cert) return <div className="container-card">Certificate not found.</div>

  return (
    <div className="container-card text-center">
      <div style={{border: '3px solid #fff', padding: '2rem', borderRadius: '8px'}}>
        <h2 style={{letterSpacing:2}}>CERTIFICATE</h2>
        <p className="small-muted">Typing Academy</p>
        <h3 style={{marginTop: '1.5rem'}}>{cert.name}</h3>
        <p className="small-muted">Has demonstrated proficiency in typing</p>
        <p>Best WPM: <strong>{cert.bestWpm}</strong> • Average WPM: <strong>{cert.avgWpm}</strong></p>
        <p className="small-muted">Issued: {new Date(cert.issued).toLocaleDateString()}</p>
        <div className="mt-3">
          <button className="btn btn-light me-2" onClick={()=>window.print()}>Print</button>
        </div>
      </div>
    </div>
  )
}

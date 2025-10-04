import React from 'react'
import { Link } from 'react-router-dom'

export default function Progress(){
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
  if(!user) return <div className="container-card">Please login to see progress.</div>

  const progress = user.progress || []
  const best = progress.reduce((a,b) => !a || b.wpm > a.wpm ? b : a, null)
  const avg = progress.length ? Math.round(progress.reduce((s,p)=> s+p.wpm,0)/progress.length) : 0

  function issueCertificate(){
    // simple certificate object in localStorage
    const certs = JSON.parse(localStorage.getItem('certificates') || '[]')
    const cert = { id: Date.now(), userId: user.id, name: user.name, issued: new Date().toISOString(), bestWpm: best ? best.wpm : 0, avgWpm: avg }
    certs.push(cert)
    localStorage.setItem('certificates', JSON.stringify(certs))
    alert('Certificate issued! You can view it in the Certificates section.')
  }

  return (
    <div className="container-card">
      <h4>Progress & Analytics</h4>
      <div className="row">
        <div className="col-md-6">
          <div className="p-3 border rounded">
            <h5>Stats</h5>
            <p>Sessions: <strong>{progress.length}</strong></p>
            <p>Best WPM: <strong>{best ? best.wpm : 0}</strong></p>
            <p>Average WPM: <strong>{avg}</strong></p>
            <p>Points: <strong>{user.points || 0}</strong></p>
            <button className="btn btn-light btn-sm" onClick={issueCertificate}>Issue Certificate</button>
            <Link to="/" className="btn btn-outline-light btn-sm ms-2">Home</Link>
          </div>
        </div>
        <div className="col-md-6">
          <h6>Session History</h6>
          <ul className="list-group list-group-dark">
            {progress.slice().reverse().map(s=>(
              <li className="list-group-item" key={s.id}>
                <div><strong>{s.mode}</strong> — WPM: {s.wpm} — Acc: {s.accuracy}% — {new Date(s.timestamp).toLocaleString()}</div>
              </li>
            ))}
            {progress.length === 0 && <li className="list-group-item small-muted">No sessions yet — try practicing.</li>}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h6>Certificates</h6>
        <CertificatesList />
      </div>
    </div>
  )
}

function CertificatesList(){
  const certs = JSON.parse(localStorage.getItem('certificates') || '[]')
  return (
    <ul className="list-group list-group-dark">
      {certs.map(c=>(
        <li className="list-group-item d-flex justify-content-between align-items-center" key={c.id}>
          <div>
            <strong>{c.name}</strong> — Issued {new Date(c.issued).toLocaleDateString()}
            <div className="small-muted">Best WPM: {c.bestWpm} • Avg WPM: {c.avgWpm}</div>
          </div>
          <a className="btn btn-sm btn-outline-light" href={`/certificate/${c.id}`}>Open</a>
        </li>
      ))}
      {certs.length === 0 && <li className="list-group-item small-muted">No certificates yet.</li>}
    </ul>
  )
}

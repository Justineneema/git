import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null')

  return (
    <div className="container-card">
      <h3>Dashboard</h3>
      {user ? (
        <>
          <p>Welcome back, <strong>{user.name}</strong></p>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="p-3 border rounded">
                <h5>Practice</h5>
                <p className="small-muted">Start typing practice and voice-typing drills.</p>
                <Link to="/practice" className="btn btn-light btn-sm">Go Practice</Link>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="p-3 border rounded">
                <h5>Progress</h5>
                <p className="small-muted">View analytics & certificates.</p>
                <Link to="/progress" className="btn btn-light btn-sm">View</Link>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="p-3 border rounded">
                <h5>School Admin</h5>
                <p className="small-muted">Create/manage school accounts (teachers/admins).</p>
                <Link to="/school-admin" className="btn btn-light btn-sm">Open</Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Please <Link to="/login">login</Link> or <Link to="/signup">signup</Link>.</p>
      )}
    </div>
  )
}

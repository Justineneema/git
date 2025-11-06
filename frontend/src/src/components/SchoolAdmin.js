import React, { useState } from 'react'

export default function SchoolAdmin(){
  const [schoolName, setSchoolName] = useState('')
  const [schools, setSchools] = useState(JSON.parse(localStorage.getItem('schools') || '[]'))

  function createSchool(e){
    e.preventDefault()
    const s = { id: Date.now(), name: schoolName, members: [] }
    const updated = [...schools, s]
    setSchools(updated)
    localStorage.setItem('schools', JSON.stringify(updated))
    setSchoolName('')
  }

  function assignUserToSchool(userId, schoolId){
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const schoolsLocal = JSON.parse(localStorage.getItem('schools') || '[]')
    const school = schoolsLocal.find(s=>s.id === schoolId)
    if(!school) return
    if(!school.members.includes(userId)) school.members.push(userId)
    localStorage.setItem('schools', JSON.stringify(schoolsLocal))
    setSchools(schoolsLocal)
    alert('Assigned!')
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]')

  return (
    <div className="container-card">
      <h4>School Account Management</h4>
      <form onSubmit={createSchool} className="mb-3">
        <div className="d-flex gap-2">
          <input className="form-control bg-black text-white" value={schoolName} onChange={e=>setSchoolName(e.target.value)} placeholder="New school name" required />
          <button className="btn btn-light">Create School</button>
        </div>
      </form>

      <div className="row">
        <div className="col-md-6">
          <h6>Schools</h6>
          <ul className="list-group list-group-dark">
            {schools.map(s=>(
              <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{s.name}</strong>
                  <div className="small-muted">Members: {s.members.length}</div>
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-light me-1" onClick={()=>{ const id = prompt('Enter user id to assign'); if(id) assignUserToSchool(Number(id), s.id) }}>Assign by ID</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h6>Users (IDs)</h6>
          <ul className="list-group list-group-dark">
            {users.map(u=>(
              <li className="list-group-item" key={u.id}>
                {u.name} — <span className="small-muted">id: {u.id}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="small-muted mt-3">This front-end demo stores schools and user assignments in localStorage. In a real product you'd connect to a backend and add role-based auth.</p>
    </div>
  )
}

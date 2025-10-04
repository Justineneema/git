import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Leaderboard(){
  const [leaders, setLeaders] = useState([])

  useEffect(()=>{
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    // compute best performance and completion percentage from progress
    const enriched = users.map(u=>{
      const best = (u.progress || []).reduce((acc, s) => {
        if(!acc || s.wpm > acc.wpm) return s
        return acc
      }, null)
      const completions = (u.progress || []).filter(s=>s.completed).length
      const total = (u.progress || []).length || 1
      const completionRate = Math.round((completions / total) * 100)
      return {
        id: u.id,
        name: u.name,
        points: u.points || 0,
        bestWpm: best ? best.wpm : 0,
        completionRate
      }
    })
    enriched.sort((a,b)=> b.points - a.points || b.bestWpm - a.bestWpm)
    setLeaders(enriched)
  },[])

  return (
    <div className="container-card">
      <h4>Leaderboard</h4>
      <p className="small-muted">Ranked by points and performance. Completion shows how many sessions were finished.</p>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Points</th>
            <th>Best WPM</th>
            <th>Completion</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((l, i)=>(
            <tr key={l.id}>
              <td>{i+1}</td>
              <td>{l.name}</td>
              <td>{l.points}</td>
              <td>{l.bestWpm}</td>
              <td>{l.completionRate}%</td>
              <td><Link className="btn btn-sm btn-outline-light" to="/progress">View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

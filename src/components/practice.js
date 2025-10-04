import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const TEXTS = {
  beginner: "The quick brown fox jumps over the lazy dog.",
  intermediate: "Practice makes perfect. Keep your eyes on the screen and your fingers on the home row.",
  advanced: "In programming, clarity of thought is more important than brevity of code. Continue to practice daily."
}

export default function Practice(){
  const [mode, setMode] = useState('beginner')
  const [text, setText] = useState(TEXTS.beginner)
  const [input, setInput] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [completed, setCompleted] = useState(false)
  const navigate = useNavigate()
  const textRef = useRef(null)

  // Voice typing
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(()=>{
    setText(TEXTS[mode])
    reset()
  }, [mode])

  function reset(){
    setInput('')
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setCompleted(false)
  }

  function handleInputChange(e){
    const val = e.target.value
    if(!startTime) setStartTime(Date.now())
    setInput(val)

    // compute progress
    const totalTyped = val.length
    const matches = [...val].filter((c,i)=> c === text[i]).length
    setAccuracy(totalTyped ? Math.round((matches/totalTyped)*100) : 100)

    // check completion
    if(val === text){
      setCompleted(true)
      const durationMin = (Date.now() - startTime) / 60000
      const words = text.split(/\s+/).length
      const computedWpm = Math.round(words / Math.max(0.01, durationMin))
      setWpm(computedWpm)
      saveSession(computedWpm, true)
      // give points
      awardPoints(computedWpm)
    }
  }

  function saveSession(wpmValue, completedFlag){
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if(!user) { alert('Please login to save progress'); return }
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const me = users.find(u => u.id === user.id)
    if(!me) return
    const session = { id: Date.now(), mode, wpm: wpmValue, accuracy, completed: completedFlag, timestamp: new Date().toISOString() }
    me.progress = me.progress || []
    me.progress.push(session)
    localStorage.setItem('users', JSON.stringify(users))
    // update currentUser store
    localStorage.setItem('currentUser', JSON.stringify(me))
  }

  function awardPoints(wpmValue){
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if(!user) return
    const me = users.find(u => u.id === user.id)
    const gained = Math.max(5, Math.round(wpmValue/2))
    me.points = (me.points || 0) + gained
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(me))
  }

  // Voice typing: use Web Speech API
  useEffect(()=>{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if(SpeechRecognition){
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
      recognitionRef.current.onresult = (e) => {
        const transcript = Array.from(e.results).map(r=> r[0].transcript).join(' ')
        setInput(prev => (prev + ' ' + transcript).trim())
      }
      recognitionRef.current.onend = () => {
        setListening(false)
      }
    }
  }, [])

  function toggleListening(){
    if(!recognitionRef.current){ alert('Voice typing not supported in this browser.') ; return }
    if(listening){
      recognitionRef.current.stop()
      setListening(false)
    } else {
      recognitionRef.current.start()
      setListening(true)
    }
  }

  return (
    <div className="container-card">
      <h4>Typing Practice</h4>

      <div className="d-flex gap-2 mb-3">
        <select value={mode} onChange={e=>setMode(e.target.value)} className="form-select w-auto bg-black text-white">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button className="btn btn-outline-light btn-sm" onClick={reset}>Reset</button>
        <button className={`btn btn-sm ${listening ? 'btn-danger' : 'btn-light'}`} onClick={toggleListening}>
          {listening ? 'Stop Voice Typing' : 'Start Voice Typing'}
        </button>
        <button className="btn btn-light btn-sm" onClick={()=>navigate('/leaderboard')}>View Leaderboard</button>
      </div>

      <div className="mb-3">
        <div className="p-3 border rounded bg-black small-muted">
          <strong>Text:</strong>
          <p ref={textRef}>{text}</p>
        </div>
      </div>

      <div className="mb-3">
        <textarea value={input} onChange={handleInputChange} rows={4} className="form-control bg-black text-white" placeholder="Type here..."></textarea>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div>WPM: <kbd>{wpm}</kbd> &nbsp; Accuracy: <kbd>{accuracy}%</kbd></div>
          <div className="small-muted">Completion: <kbd>{completed ? '100%' : Math.round((input.length / text.length)*100) + '%'}</kbd></div>
        </div>
        <div>
          <a className="btn btn-outline-light btn-sm me-2" onClick={()=>{ if(window.confirm('Generate certificate?')) navigate('/progress') }}>Save & Generate Report</a>
        </div>
      </div>

      <hr className="my-3" />

      <h5>On-screen Keyboard</h5>
      <p className="small-muted">Reference keyboard (SVG). Use this to learn finger placement.</p>

      {/* Simple inline SVG keyboard — this acts as the required “image of keyboard” for the practice page */}
      <svg className="keyboard-svg" viewBox="0 0 1000 250" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="980" height="230" rx="12" fill="#0a0a0a" stroke="#222" />
        {/* rows of keys - simplified */}
        {Array.from({length:4}).map((_,row)=> (
          <g key={row} transform={`translate(${20 + (row%2)*10}, ${30 + row*50})`}>
            {Array.from({length:14 - row*2}).map((__,i)=> (
              <g key={i}>
                <rect x={i*68} y={0} width={60} height={36} rx="6" fill="#111" stroke="#333"/>
                <text x={i*68 + 30} y={23} fontSize="12" fill="#ddd" textAnchor="middle"> {row===0 ? ['Esc','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','Pr'][i] :
                  row===1 ? ['`','1','2','3','4','5','6','7','8','9','0','-','=','Back'][i] :
                  row===2 ? ['Tab','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'][i] :
                  ['Caps','A','S','D','F','G','H','J','K','L',';','\'','Enter',''][i]
                }</text>
              </g>
            ))}
          </g>
        ))}
        {/* spacebar */}
        <rect x="200" y="210" width="600" height="24" rx="6" fill="#111" stroke="#333"/>
        <text x="500" y="228" textAnchor="middle" fill="#ddd">Space</text>
      </svg>

      <div className="mt-3 small-muted">
        <strong>Tip:</strong> Start with beginner mode for accuracy. The app awards points (used on leaderboard).
      </div>
    </div>
  )
}

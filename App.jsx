import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Google Fonts ── */
const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Poppins:wght@400;500;600&display=swap'
document.head.appendChild(fontLink)

/* ── Floating Hearts Canvas ── */
function FloatingHearts({ burst }) {
  const ref = useRef(null)
  const hearts = useRef([])
  const raf = useRef(null)

  const make = useCallback((canvas, isBurst = false) => {
    const e = ['❤️','🩷','✨','💕','💗','🌸']
    return {
      x: Math.random() * canvas.width,
      y: isBurst ? canvas.height * 0.5 : canvas.height + 20,
      emoji: e[Math.floor(Math.random() * e.length)],
      size: isBurst ? 20 + Math.random() * 30 : 14 + Math.random() * 20,
      speed: isBurst ? 2 + Math.random() * 5 : 0.4 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * (isBurst ? 5 : 1.2),
      opacity: isBurst ? 0.9 : 0.5 + Math.random() * 0.4,
      rot: Math.random() * 360,
      rotS: (Math.random() - 0.5) * 3,
    }
  }, [])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    for (let i = 0; i < 18; i++) { const h = make(canvas); h.y = Math.random() * canvas.height; hearts.current.push(h) }
    if (burst) for (let i = 0; i < 60; i++) hearts.current.push(make(canvas, true))
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      hearts.current.forEach(h => {
        ctx.save(); ctx.globalAlpha = h.opacity; ctx.font = `${h.size}px serif`
        ctx.translate(h.x, h.y); ctx.rotate(h.rot * Math.PI / 180)
        ctx.fillText(h.emoji, -h.size / 2, h.size / 2); ctx.restore()
        h.y -= h.speed; h.x += h.drift; h.rot += h.rotS
        if (h.y < -40) Object.assign(h, make(canvas))
      })
      if (Math.random() < 0.03) hearts.current.push(make(canvas))
      if (hearts.current.length > 90) hearts.current.splice(0, 5)
      raf.current = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', resize) }
  }, [burst, make])

  return <canvas ref={ref} style={{ position:'fixed', top:0, left:0, pointerEvents:'none', zIndex:0 }} />
}

/* ── Calendar ── */
function Calendar({ selected, onSelect }) {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']
  const firstDay = new Date(year, month, 1).getDay()
  const total = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({length:total},(_,i)=>i+1)]
  const isSel = d => selected && selected.getDate()===d && selected.getMonth()===month && selected.getFullYear()===year
  const isPast = d => new Date(year,month,d) < new Date(today.getFullYear(),today.getMonth(),today.getDate())
  const prev = () => month===0 ? (setMonth(11),setYear(y=>y-1)) : setMonth(m=>m-1)
  const next = () => month===11 ? (setMonth(0),setYear(y=>y+1)) : setMonth(m=>m+1)

  return (
    <div style={{background:'rgba(255,255,255,0.8)',borderRadius:24,padding:'20px 16px',boxShadow:'0 8px 40px rgba(236,72,153,0.13)',maxWidth:340,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <button onClick={prev} style={{background:'none',border:'none',fontSize:22,color:'#ec4899',cursor:'pointer',padding:'0 8px'}}>‹</button>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:'#be185d'}}>{MONTHS[month]} {year}</span>
        <button onClick={next} style={{background:'none',border:'none',fontSize:22,color:'#ec4899',cursor:'pointer',padding:'0 8px'}}>›</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:6}}>
        {DAYS.map(d=><div key={d} style={{textAlign:'center',fontSize:11,color:'#f9a8d4',fontFamily:"'Poppins',sans-serif",fontWeight:600}}>{d}</div>)}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4}}>
        {cells.map((d,i)=>(
          <motion.button key={i}
            whileHover={d&&!isPast(d)?{scale:1.15}:{}}
            whileTap={d&&!isPast(d)?{scale:0.93}:{}}
            onClick={()=>d&&!isPast(d)&&onSelect(new Date(year,month,d))}
            style={{border:'none',borderRadius:10,padding:'8px 0',fontFamily:"'Poppins',sans-serif",fontSize:13,
              background:isSel(d)?'linear-gradient(135deg,#ec4899,#f43f5e)':'transparent',
              color:isSel(d)?'#fff':isPast(d)?'#fca5a5':d?'#831843':'transparent',
              cursor:d&&!isPast(d)?'pointer':'default',fontWeight:isSel(d)?700:400,
              boxShadow:isSel(d)?'0 4px 14px rgba(236,72,153,0.45)':'none'}}>
            {d||''}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

/* ── Shared Styles ── */
const S = {
  card: {background:'rgba(255,255,255,0.7)',backdropFilter:'blur(20px)',borderRadius:32,padding:'36px 28px',
    boxShadow:'0 12px 60px rgba(236,72,153,0.15)',border:'1px solid rgba(249,168,212,0.3)',textAlign:'center'},
  h1: {fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:28,color:'#831843',lineHeight:1.25,marginBottom:8},
  sub: {fontFamily:"'Poppins',sans-serif",fontSize:14,color:'#f472b6',fontWeight:400},
  btn: {background:'linear-gradient(135deg,#ec4899,#f43f5e)',color:'#fff',border:'none',borderRadius:50,
    padding:'14px 36px',fontFamily:"'Poppins',sans-serif",fontWeight:600,fontSize:15,cursor:'pointer',
    boxShadow:'0 6px 24px rgba(236,72,153,0.38)'},
  ghost: {background:'rgba(255,255,255,0.6)',color:'#f472b6',border:'1.5px solid rgba(244,114,182,0.4)',
    borderRadius:50,padding:'14px 28px',fontFamily:"'Poppins',sans-serif",fontWeight:500,fontSize:15,cursor:'pointer'},
  pill: {border:'none',borderRadius:18,padding:'16px 20px',display:'flex',alignItems:'center',gap:16,
    cursor:'pointer',width:'100%',fontFamily:"'Poppins',sans-serif"},
  food: {border:'none',borderRadius:18,padding:'16px 8px',cursor:'pointer',display:'flex',
    flexDirection:'column',alignItems:'center',fontFamily:"'Poppins',sans-serif"},
}

const pv = {
  initial:{opacity:0,y:40},
  animate:{opacity:1,y:0,transition:{duration:0.5,ease:[0.22,1,0.36,1]}},
  exit:{opacity:0,y:-30,transition:{duration:0.3}},
}

const NO_MSG = ['Are you sure? 🥺','Think again! 💭','Come on... 🫶','Last chance! 👀','Pleeeease? 🥺','My heart! 💔','You know you want to! ✨']
const TIMES = [{label:'Evening',time:'7:00 PM',icon:'🌅'},{label:'Night',time:'8:30 PM',icon:'🌙'},{label:'Late Night',time:'10:00 PM',icon:'✨'}]
const FOODS = [
  {emoji:'🍣',name:'Sushi'},{emoji:'🍝',name:'Pasta'},{emoji:'🍕',name:'Pizza'},
  {emoji:'🍛',name:'Biryani'},{emoji:'🍢',name:'Kebabs'},{emoji:'🌮',name:'Tacos'},
  {emoji:'🍜',name:'Ramen'},{emoji:'🍔',name:'Burgers'},{emoji:'🍰',name:'Desserts'},
]

const fmtDate = d => d ? d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) : ''

/* ── App ── */
export default function App() {
  const [screen, setScreen] = useState(0)
  const [noCount, setNoCount] = useState(0)
  const [noPos, setNoPos] = useState({x:0,y:0})
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [foods, setFoods] = useState([])

  const runAway = () => {
    setNoPos({x:(Math.random()-0.5)*280, y:(Math.random()-0.5)*180})
    setNoCount(c=>c+1)
  }

  const toggleFood = name => setFoods(f=>f.includes(name)?f.filter(x=>x!==name):[...f,name])

  const addToCalendar = () => {
    if (!date) return
    const [h,m] = time?.time?.replace(' PM','').split(':').map(Number)||[19,0]
    const start = new Date(date); start.setHours(h+12<24?h+12:h,m,0)
    const end = new Date(start.getTime()+2*60*60*1000)
    const fmt = d=>d.toISOString().replace(/[-:]/g,'').slice(0,15)+'Z'
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Our Date Night 💕')}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent('We\'re having: '+foods.join(', '))}`, '_blank')
  }

  const restart = () => { setScreen(0); setDate(null); setTime(null); setFoods([]); setNoCount(0); setNoPos({x:0,y:0}) }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#FCE7F3 0%,#FFF1F2 50%,#fce4ec 100%)',
      display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',position:'relative'}}>

      <FloatingHearts burst={screen===4} />

      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:480,padding:'0 16px'}}>
        <AnimatePresence mode="wait">

          {/* Screen 0 — Question */}
          {screen===0 && (
            <motion.div key="s0" {...pv} style={S.card}>
              <motion.div animate={{scale:[1,1.15,1],rotate:[0,5,-5,0]}} transition={{repeat:Infinity,duration:2.4}}
                style={{fontSize:72,marginBottom:8}}>❤️</motion.div>
              <h1 style={S.h1}>Will you go on a date with me?</h1>
              <p style={S.sub}>A question worth asking</p>
              <div style={{position:'relative',height:120,display:'flex',alignItems:'center',justifyContent:'center',gap:24,marginTop:16}}>
                <motion.button whileHover={{scale:1.07}} whileTap={{scale:0.95}} onClick={()=>setScreen(1)} style={S.btn}>
                  Yes ❤️
                </motion.button>
                <motion.button
                  animate={{x:noPos.x,y:noPos.y}} transition={{type:'spring',stiffness:300,damping:18}}
                  onHoverStart={runAway} onClick={runAway}
                  style={{...S.ghost,opacity:Math.max(0.15,1-noCount*0.12),fontSize:Math.max(10,15-noCount)}}>
                  {noCount===0?'No 🙈':NO_MSG[Math.min(noCount-1,NO_MSG.length-1)]}
                </motion.button>
              </div>
              {noCount>3&&<motion.p initial={{opacity:0}} animate={{opacity:1}}
                style={{color:'#f472b6',fontFamily:"'Poppins',sans-serif",fontSize:13,marginTop:8}}>
                The &quot;No&quot; button has a mind of its own 😉
              </motion.p>}
            </motion.div>
          )}

          {/* Screen 1 — Date */}
          {screen===1 && (
            <motion.div key="s1" {...pv} style={S.card}>
              <h1 style={S.h1}>When are you free?</h1>
              <p style={S.sub}>Pick a date</p>
              <div style={{marginTop:20}}><Calendar selected={date} onSelect={setDate} /></div>
              {date&&(
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                  <p style={{color:'#be185d',fontFamily:"'Poppins',sans-serif",fontSize:14,marginTop:14}}>✨ {fmtDate(date)}</p>
                  <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.96}}
                    onClick={()=>setScreen(2)} style={{...S.btn,marginTop:16,width:'100%'}}>
                    Perfect →
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Screen 2 — Time */}
          {screen===2 && (
            <motion.div key="s2" {...pv} style={S.card}>
              <h1 style={S.h1}>What time?</h1>
              <p style={S.sub}>Choose your hour</p>
              <div style={{display:'flex',flexDirection:'column',gap:14,marginTop:24}}>
                {TIMES.map(t=>(
                  <motion.button key={t.time} whileHover={{scale:1.03,x:4}} whileTap={{scale:0.97}}
                    onClick={()=>setTime(t)}
                    style={{...S.pill,
                      background:time?.time===t.time?'linear-gradient(135deg,#ec4899,#f43f5e)':'rgba(255,255,255,0.72)',
                      color:time?.time===t.time?'#fff':'#9d174d',
                      boxShadow:time?.time===t.time?'0 6px 20px rgba(236,72,153,0.38)':'0 2px 12px rgba(236,72,153,0.1)'}}>
                    <span style={{fontSize:22}}>{t.icon}</span>
                    <div style={{textAlign:'left'}}>
                      <div style={{fontWeight:600,fontSize:15}}>{t.label}</div>
                      <div style={{fontSize:12,opacity:0.8}}>{t.time}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
              {time&&<motion.button initial={{opacity:0}} animate={{opacity:1}}
                whileHover={{scale:1.05}} whileTap={{scale:0.96}}
                onClick={()=>setScreen(3)} style={{...S.btn,marginTop:22,width:'100%'}}>
                Let&apos;s continue →
              </motion.button>}
            </motion.div>
          )}

          {/* Screen 3 — Food */}
          {screen===3 && (
            <motion.div key="s3" {...pv} style={S.card}>
              <h1 style={S.h1}>What are we feeling?</h1>
              <p style={S.sub}>Pick one or more</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:22}}>
                {FOODS.map(f=>{
                  const sel=foods.includes(f.name)
                  return (
                    <motion.button key={f.name} whileHover={{scale:1.08,y:-2}} whileTap={{scale:0.92}}
                      animate={sel?{scale:[1,1.15,1]}:{}} transition={sel?{duration:0.3}:{}}
                      onClick={()=>toggleFood(f.name)}
                      style={{...S.food,
                        background:sel?'linear-gradient(135deg,#ec4899,#f43f5e)':'rgba(255,255,255,0.72)',
                        color:sel?'#fff':'#9d174d',
                        boxShadow:sel?'0 6px 18px rgba(236,72,153,0.4)':'0 2px 10px rgba(236,72,153,0.1)',
                        border:sel?'2px solid transparent':'2px solid rgba(236,72,153,0.15)'}}>
                      <div style={{fontSize:28}}>{f.emoji}</div>
                      <div style={{fontSize:12,fontWeight:500,marginTop:4}}>{f.name}</div>
                    </motion.button>
                  )
                })}
              </div>
              {foods.length>0&&<motion.button initial={{opacity:0}} animate={{opacity:1}}
                whileHover={{scale:1.05}} whileTap={{scale:0.96}}
                onClick={()=>setScreen(4)} style={{...S.btn,marginTop:22,width:'100%'}}>
                Let&apos;s make it official ✨
              </motion.button>}
            </motion.div>
          )}

          {/* Screen 4 — Final */}
          {screen===4 && (
            <motion.div key="s4" {...pv} style={{...S.card,padding:'40px 28px'}}>
              <motion.div initial={{scale:0,rotate:-20}} animate={{scale:1,rotate:0}}
                transition={{type:'spring',stiffness:200,damping:14}} style={{fontSize:48,marginBottom:4}}>✨</motion.div>
              <h1 style={{...S.h1,fontSize:34}}>It&apos;s a Date</h1>
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                style={{background:'linear-gradient(135deg,rgba(252,231,243,0.7),rgba(255,241,242,0.7))',
                  borderRadius:20,padding:'24px 20px',margin:'16px auto 0',maxWidth:320,
                  border:'1px solid rgba(249,168,212,0.4)'}}>
                <div style={{fontSize:10,letterSpacing:'0.14em',color:'#f472b6',fontWeight:600,textTransform:'uppercase',marginBottom:4,fontFamily:"'Poppins',sans-serif"}}>WHEN</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:'#831843',fontWeight:700}}>{fmtDate(date)}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:'#831843',fontWeight:700,marginTop:2}}>{time?.time}</div>
                {foods.length>0&&<>
                  <div style={{fontSize:10,letterSpacing:'0.14em',color:'#f472b6',fontWeight:600,textTransform:'uppercase',marginTop:20,marginBottom:4,fontFamily:"'Poppins',sans-serif"}}>WHAT WE&apos;RE HAVING</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:'#831843',fontWeight:700}}>{foods.join(' • ')}</div>
                </>}
              </motion.div>
              <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}
                style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',color:'#be185d',
                  fontSize:15,lineHeight:1.7,margin:'22px 0 24px',padding:'0 8px'}}>
                &ldquo;Every great love story has a first evening. This is ours.&rdquo;
              </motion.p>
              <motion.button initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.8}}
                whileHover={{scale:1.06}} whileTap={{scale:0.96}}
                onClick={addToCalendar} style={{...S.btn,fontSize:16,padding:'16px 36px'}}>
                📅 Add to Calendar
              </motion.button>
              <motion.button initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}}
                onClick={restart}
                style={{display:'block',margin:'16px auto 0',background:'none',border:'none',
                  color:'#f9a8d4',fontFamily:"'Poppins',sans-serif",fontSize:13,cursor:'pointer',textDecoration:'underline'}}>
                Start over
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

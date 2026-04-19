'use client'

export default function Home() {

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/companylogo.png" width="45" />
          <h2>AIKYAM Corporate Services</h2>
        </div>

        <div style={{ display: 'flex', gap: 25 }}>
          {['services', 'contact'].map(item => (
            <span key={item} onClick={() => scrollTo(item)} style={nav}>
              {item.toUpperCase()}
            </span>
          ))}
          <a href="/login"><button style={loginBtn}>Login</button></a>
        </div>
      </div>

      {/* HERO */}
      <div style={hero}>
        <div style={glow}></div>

        <h1 style={heroTitle}>
          Smart Compliance.<br />Seamless Experience.
        </h1>

        <p style={heroText}>
          Simplifying GST, Income Tax, PF, ESI & ROC compliance with
          precision, trust and technology.
        </p>

        <button style={cta} onClick={() => scrollTo('services')}>
          Explore Services
        </button>
      </div>

      {/* SERVICES CARDS */}
      <div id="services" style={section}>
        <h2 style={title}>Our Services</h2>

        <div style={grid}>
          {
[
  {
    id: 'gst',
    title: 'GST Filing',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
  },
  {
    id: 'tax',
    title: 'Income Tax',
    gradient: 'linear-gradient(135deg, #43cea2, #185a9d)'
  },
  {
    id: 'pf',
    title: 'PF & ESI',
    gradient: 'linear-gradient(135deg, #ff9966, #ff5e62)'
  },
  {
    id: 'roc',
    title: 'ROC Compliance',
    gradient: 'linear-gradient(135deg, #00c6ff, #0072ff)'
  }
]
            .map((s) => (
       <div
  key={s.id}
  style={{
    ...card,
    background: s.gradient
  }}
  onClick={() => scrollTo(s.id)}
  onMouseOver={(e) => {
    e.currentTarget.style.transform = 'translateY(-8px)'
    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.2)'
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
  }}
>
  {s.title}
</div>
          ))}
        </div>
      </div>

      {/* SERVICE DETAILS */}

      <div id="gst" style={detail}>
        <h2>GST Filing</h2>
        <p>
          We ensure accurate and timely GST return filing, input tax credit optimization,
          and compliance with all statutory regulations. Our process minimizes errors and
          helps businesses avoid penalties.
        </p>
      </div>

      <div id="tax" style={detailAlt}>
        <h2>Income Tax Services</h2>
        <p>
          From individual returns to corporate tax planning, we provide end-to-end support.
          Our experts help reduce liabilities and ensure compliance with changing tax laws.
        </p>
      </div>

      <div id="pf" style={detail}>
        <h2>PF & ESI Compliance</h2>
        <p>
          Complete handling of employee compliance including PF & ESI registrations,
          filings, and audits. We ensure your workforce compliance is always up to date.
        </p>
      </div>

      <div id="roc" style={detailAlt}>
        <h2>ROC Compliance</h2>
        <p>
          We manage company filings, annual returns, and statutory compliance with ROC.
          Stay compliant and focus on growing your business while we handle governance.
        </p>
      </div>

      {/* CONTACT */}
      <div id="contact" style={section}>
        <h2 style={title}>Contact Us</h2>

        <div style={contact}>
          <p><b>AIKYAM Corporate Services</b></p>
          <p>Vasavi MPM, Ameerpet, Hyderabad</p>
          <p>📞 +91 XXXXX XXXXX</p>
          <p>✉ info@aikyamcs.com</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={footer}>
        © 2026 AIKYAM Corporate Services
      </div>

    </div>
  )
}

/* STYLES */

const container = {
  fontFamily: 'Inter, sans-serif',
  background: '#f8faff'
}

const header = {
  position: 'sticky',
  top: 0,
  display: 'flex',
  justifyContent: 'space-between',
  padding: '18px 50px',
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(12px)',
  zIndex: 1000
}

const nav = {
  cursor: 'pointer',
  fontWeight: 500
}

const loginBtn = {
  padding: '8px 18px',
  borderRadius: 8,
  border: 'none',
  background: '#0070f3',
  color: '#fff'
}

const hero = {
  textAlign: 'center',
  padding: '120px 20px',
  position: 'relative'
}

const glow = {
  position: 'absolute',
  width: 400,
  height: 400,
  background: 'radial-gradient(circle, #0070f3, transparent)',
  filter: 'blur(120px)',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: -1
}

const heroTitle = {
  fontSize: 54,
  fontWeight: 700
}

const heroText = {
  fontSize: 18,
  color: '#555',
  marginTop: 15
}

const cta = {
  marginTop: 30,
  padding: '14px 30px',
  borderRadius: 10,
  border: 'none',
  background: '#0070f3',
  color: '#fff',
  cursor: 'pointer'
}

const section = {
  padding: 70
}

const title = {
  textAlign: 'center',
  marginBottom: 40
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))',
  gap: 25
}

const card = {
  padding: 30,
  borderRadius: 18,
  cursor: 'pointer',
  textAlign: 'center',
  fontSize: 18,
  color: '#fff',
  transition: '0.3s',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
}

const detail = {
  padding: 80,
  background: '#fff'
}

const detailAlt = {
  padding: 80,
  background: '#f1f5ff'
}

const contact = {
  textAlign: 'center',
  lineHeight: 2
}

const footer = {
  padding: 25,
  textAlign: 'center',
  background: '#111',
  color: '#fff'
}

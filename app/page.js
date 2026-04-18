'use client'
export default function Home() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#111' }}>

      {/* HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 50px',
        position: 'sticky',
        top: 0,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #eee',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/companylogo.png" width="45" />
          <h2 style={{ fontWeight: 600 }}>AIKYA Consultancy</h2>
        </div>

        <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
          {['Services', 'About', 'Contact'].map((item, i) => (
            <a key={i} href={`#${item.toLowerCase()}`}
              style={{
                textDecoration: 'none',
                color: '#333',
                fontWeight: 500,
                transition: '0.3s'
              }}
              onMouseOver={e => e.target.style.color = '#0070f3'}
              onMouseOut={e => e.target.style.color = '#333'}
            >
              {item}
            </a>
          ))}

          <a href="/login">
            <button style={{
              padding: '10px 20px',
              background: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              transition: '0.3s',
              boxShadow: '0 4px 14px rgba(0,118,255,0.3)'
            }}
              onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.target.style.transform = 'scale(1)'}
            >
              Login
            </button>
          </a>
        </div>
      </div>

      {/* HERO */}
      <div style={{
        padding: '100px 40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #eef3ff, #ffffff)'
      }}>
        <h1 style={{
          fontSize: 46,
          fontWeight: 700,
          marginBottom: 20
        }}>
          Smart Compliance. Seamless Experience.
        </h1>

        <p style={{
          fontSize: 18,
          color: '#555',
          maxWidth: 700,
          margin: 'auto'
        }}>
          GST, Income Tax, PF, ESI & ROC compliance services designed
          to simplify your business operations.
        </p>

        <a href="/login">
          <button style={{
            marginTop: 30,
            padding: '14px 32px',
            fontSize: 16,
            background: '#0070f3',
            color: '#fff',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            transition: '0.3s',
            boxShadow: '0 6px 20px rgba(0,118,255,0.3)'
          }}
            onMouseOver={e => e.target.style.transform = 'translateY(-3px)'}
            onMouseOut={e => e.target.style.transform = 'translateY(0)'}
          >
            Access Client Portal
          </button>
        </a>
      </div>

      {/* SERVICES */}
      <div id="services" style={{ padding: 60 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 40 }}>
          Our Services
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))',
          gap: 25
        }}>
          {[
            { title: "GST Filing", desc: "Accurate GST returns & compliance." },
            { title: "Income Tax", desc: "Professional tax filing services." },
            { title: "PF & ESI", desc: "Employee compliance management." },
            { title: "ROC Compliance", desc: "Corporate filings & governance." }
          ].map((s, i) => (
            <div key={i}
              style={{
                padding: 25,
                borderRadius: 12,
                background: '#fff',
                transition: '0.3s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <h3>{s.title}</h3>
              <p style={{ color: '#555' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WHY US */}
      <div style={{ padding: 60, background: '#f9f9f9' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 40 }}>
          Why Choose Us
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
          gap: 20,
          textAlign: 'center'
        }}>
          {[
            "Experienced Professionals",
            "On-Time Compliance",
            "Secure Data Handling",
            "Dedicated Support"
          ].map((item, i) => (
            <div key={i}
              style={{
                padding: 20,
                borderRadius: 10,
                background: '#fff',
                transition: '0.3s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              ✔ {item}
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <div id="contact" style={{ padding: 60 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>
          Contact Us
        </h2>

        <div style={{
          textAlign: 'center',
          lineHeight: 2,
          color: '#555'
        }}>
          <p><b>AIKYAM Corporate Services</b></p>
          <p>Vasavi MPM, Ameerpet, Hyderabad</p>
          <p>📞 +91 XXXXX XXXXX</p>
          <p>✉ info@aikyamcs.com</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: 25,
        textAlign: 'center',
        background: '#111',
        color: '#fff'
      }}>
        © 2026 AIKYA Consultancy
      </div>

    </div>
  )
}

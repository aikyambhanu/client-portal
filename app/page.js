import Header from '../components/Header'

export default function Home() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>

      {/* HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 40px',
        borderBottom: '1px solid #eee',
        position: 'sticky',
        top: 0,
        background: '#fff',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/companylogo.png" width="40" />
          <h2>AIKYA Management Consultancy</h2>
        </div>

        <div style={{ display: 'flex', gap: 25 }}>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>

          <a href="/login">
            <button style={{
              padding: '8px 16px',
              background: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}>
              Login
            </button>
          </a>
        </div>
      </div>

      {/* HERO */}
      <div style={{
        padding: '80px 40px',
        background: 'linear-gradient(to right, #f0f4ff, #ffffff)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: 42, marginBottom: 20 }}>
          Complete Compliance & Audit Solutions
        </h1>

        <p style={{ fontSize: 18, color: '#555', maxWidth: 700, margin: 'auto' }}>
          We provide expert services in GST, Income Tax, PF, ESI and Company Compliance
          ensuring your business stays fully compliant and stress-free.
        </p>

        <a href="/login">
          <button style={{
            marginTop: 30,
            padding: '12px 28px',
            fontSize: 16,
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}>
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
            {
              title: "GST Filing",
              desc: "Monthly & quarterly GST returns with accuracy and compliance."
            },
            {
              title: "Income Tax",
              desc: "ITR filing for individuals, businesses and professionals."
            },
            {
              title: "PF & ESI",
              desc: "Complete employee compliance including filings and returns."
            },
            {
              title: "ROC Compliance",
              desc: "Company law compliance, filings and annual returns."
            }
          ].map((s, i) => (
            <div key={i} style={{
              padding: 25,
              border: '1px solid #ddd',
              borderRadius: 10,
              background: '#fff'
            }}>
              <h3>{s.title}</h3>
              <p style={{ color: '#555' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <div id="about" style={{
        padding: 60,
        background: '#f9f9f9'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>
          About Us
        </h2>

        <p style={{
          maxWidth: 800,
          margin: 'auto',
          textAlign: 'center',
          color: '#555'
        }}>
          AIKYA Management Consultancy is dedicated to providing professional
          audit and compliance services. With deep expertise in taxation and
          corporate regulations, we ensure seamless and reliable service for
          businesses of all sizes.
        </p>
      </div>

      {/* WHY US */}
      <div style={{ padding: 60 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 40 }}>
          Why Choose Us
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))',
          gap: 20,
          textAlign: 'center'
        }}>
          <div>✔ Experienced Professionals</div>
          <div>✔ Timely Filing & Compliance</div>
          <div>✔ Secure Document Handling</div>
          <div>✔ Dedicated Client Support</div>
        </div>
      </div>

      {/* CONTACT */}
      <div id="contact" style={{
        padding: 60,
        background: '#f5f5f5'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>
          Contact Us
        </h2>

        <div style={{ textAlign: 'center', lineHeight: 2 }}>
          <p>📍 AIKYAM Corporate Services</p>
          <p>Vasavi MPM, Ameerpet, Telangana, India</p>
          <p>📞 +91 92915 02262</p>
          <p>✉ info@aikyamcs.com</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: 20,
        background: '#111',
        color: '#fff',
        textAlign: 'center'
      }}>
        <p>© 2026 AIKYAM Corporate Services. All rights reserved.</p>
      </div>

    </div>
  )
}

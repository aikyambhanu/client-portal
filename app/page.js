import Header from '../components/Header'

export default function Home() {
  return (
    <div>

      <Header />

      {/* HERO */}
      <div style={{
        padding: '80px 40px',
        background: '#f5f7fa',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: 40, marginBottom: 20 }}>
          Professional Audit & Compliance Services
        </h1>

        <p style={{ fontSize: 18, color: '#555' }}>
          GST, Income Tax, PF, ESI & Company Compliance — all in one place
        </p>

        <button style={{
          marginTop: 20,
          padding: '12px 24px',
          fontSize: 16,
          cursor: 'pointer'
        }}>
          Client Login
        </button>
      </div>

      {/* SERVICES */}
      <div style={{ padding: 40 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>
          Our Services
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))',
          gap: 20
        }}>
          {[
            "GST Filing",
            "Income Tax Returns",
            "PF & ESI Compliance",
            "Company / ROC Compliance"
          ].map((service, i) => (
            <div key={i} style={{
              border: '1px solid #ddd',
              padding: 20,
              borderRadius: 8,
              textAlign: 'center'
            }}>
              <h3>{service}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* WHY US */}
      <div style={{
        padding: 40,
        background: '#f9f9f9'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>
          Why Choose Us
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))',
          gap: 20
        }}>
          <div>✔ Experienced Professionals</div>
          <div>✔ Timely Compliance</div>
          <div>✔ Secure Document Handling</div>
          <div>✔ Dedicated Support</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: 20,
        textAlign: 'center',
        background: '#222',
        color: '#fff'
      }}>
        <p>© 2026 AuditPro Services</p>
        <p>Contact: +91 92915 02262</p>
      </div>

    </div>
  )
}

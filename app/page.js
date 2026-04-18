
import Link from 'next/link'
export default function Home() {
  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid #ddd"
      }}>
        <h2>AuditPro Services</h2>
<Link href="/login">
  <button style={{ padding: "8px 16px", cursor: "pointer" }}>
    Login
  </button>
</Link>
      </div>

      {/* Hero Section */}
      <div style={{ padding: "40px" }}>
        <h1>Welcome to Our Client Portal</h1>
        <p>
          Securely access your documents, compliance reports, and requests in one place.
        </p>
      </div>

      {/* Services Section */}
      <div style={{ padding: "40px" }}>
        <h2>Our Services</h2>

        <ul style={{ lineHeight: "2" }}>
          <li>GST Filing</li>
          <li>Income Tax Returns</li>
          <li>PF & ESI Compliance</li>
          <li>Company / ROC Compliance</li>
        </ul>
      </div>
    </div>
  );
}

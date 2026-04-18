import Header from '@/components/Header'

export default function Home() {
  return (
    <div>
      <Header />

      <div style={{ padding: 40 }}>
        <h1>Welcome to Client Portal</h1>

        <h3>Services</h3>
        <ul>
          <li>GST Filing</li>
          <li>Income Tax Returns</li>
          <li>PF & ESI Compliance</li>
          <li>ROC Compliance</li>
        </ul>
      </div>
    </div>
  )
}
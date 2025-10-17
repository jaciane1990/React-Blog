// src/components/Layout.tsx
import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/">🏠 Home</Link>
      </nav>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  )
}

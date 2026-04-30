import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/album" className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <span className="font-bold text-white text-lg">Mundial 2026</span>
          </NavLink>

          <nav className="hidden sm:flex items-center gap-1">
            <NavLink
              to="/album"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-green-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              Álbum
            </NavLink>
            <NavLink
              to="/missing"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-green-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              Faltantes
            </NavLink>
            <NavLink
              to="/friends"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-green-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              Amigos
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {profile && (
              <span className="text-gray-400 text-sm hidden sm:block">
                @{profile.username}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden border-t border-gray-800 flex">
          {[
            { to: '/album', label: 'Álbum', icon: '📖' },
            { to: '/missing', label: 'Faltantes', icon: '🔍' },
            { to: '/friends', label: 'Amigos', icon: '👥' },
          ].map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex-1 py-2 text-center text-xs font-medium transition-colors flex flex-col items-center gap-0.5 ${
                  isActive ? 'text-green-400' : 'text-gray-500'
                }`
              }
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>
    </div>
  )
}

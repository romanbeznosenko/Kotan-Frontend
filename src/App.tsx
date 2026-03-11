import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import LoginPage from './pages/login/LoginPage'
import WelcomePage from './pages/welcomePage/WelcomePage'
import TeamPage from './pages/teamPage/TeamPage'
import TeamDetailPage from './pages/teamDetailPage/TeamDetailPage'
import LeaguePage from './pages/leaguePage/LeaguePage'
import LeagueDetailPage from './pages/leagueDetailPage/LeagueDetailPage'

const PrivateRoute = ({ element }: { element: React.ReactElement }) => {
  return localStorage.getItem('jwt') ? element : <Navigate to="/admin/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<PrivateRoute element={<AdminDashboardPage />} />} />
        <Route path="/" element={<WelcomePage />} />
        <Route path="/teams" element={<TeamPage />} />
        <Route path="/teams/:id" element={<TeamDetailPage />} />
        <Route path="/matches" element={<LeaguePage />} />
        <Route path="/matches/:id" element={<LeagueDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

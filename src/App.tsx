import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminArticleFormPage from './pages/admin/AdminArticleFormPage'
import LoginPage from './pages/login/LoginPage'
import WelcomePage from './pages/welcomePage/WelcomePage'
import TeamPage from './pages/teamPage/TeamPage'
import TeamDetailPage from './pages/teamDetailPage/TeamDetailPage'
import LeaguePage from './pages/leaguePage/LeaguePage'
import LeagueDetailPage from './pages/leagueDetailPage/LeagueDetailPage'
import NewsPage from './pages/newsPage/NewsPage'
import NewsDetailPage from './pages/newsDetailPage/NewsDetailPage'

const PrivateRoute = ({ element }: { element: React.ReactElement }) => {
  return localStorage.getItem('jwt') ? element : <Navigate to="/admin/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<PrivateRoute element={<AdminDashboardPage />} />} />
        <Route path="/admin/articles/create" element={<PrivateRoute element={<AdminArticleFormPage />} />} />
        <Route path="/admin/articles/:articleId/edit" element={<PrivateRoute element={<AdminArticleFormPage />} />} />
        <Route path="/" element={<WelcomePage />} />
        <Route path="/teams" element={<TeamPage />} />
        <Route path="/teams/:id" element={<TeamDetailPage />} />
        <Route path="/matches" element={<LeaguePage />} />
        <Route path="/matches/:id" element={<LeagueDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

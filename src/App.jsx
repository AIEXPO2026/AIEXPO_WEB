import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import FindPassword from './pages/FindPassword/FindPassword'
import Welcome from './pages/Welcome/Welcome'
import Community from './pages/Community/Community'
import Ranking from './pages/Ranking/Ranking'
import Blog from './pages/Blog/Blog'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/find-password" element={<FindPassword />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/community" element={<Community />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/blog" element={<Blog />} />
    </Routes>
  )
}

export default App

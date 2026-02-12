import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login/Login'
import Signup from './pages/Auth/Signup/Signup'
import FindPassword from './pages/Auth/FindPassword/FindPassword'
import Welcome from './pages/Auth/Welcome/Welcome'
import Community from './pages/Community/Community'
import CommunityRanking from './pages/Community/Ranking/CommunityRanking'
import CommunityBlog from './pages/Community/Blog/CommunityBlog'
import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/find-password" element={<FindPassword />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/home" element={<Home />} />
      <Route path="/community" element={<Community />} />
      <Route path="/community/ranking" element={<CommunityRanking />} />
      <Route path="/community/blog" element={<CommunityBlog />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App

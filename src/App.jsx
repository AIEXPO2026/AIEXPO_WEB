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
import ChangePassword from './pages/Profile/ChangePassword/ChangePassword'
import Travel from './pages/Travel/Travel'
import ReloadPrompt from './components/ReloadPrompt/ReloadPrompt'

function App() {
  return (
    <>
    <ReloadPrompt />
    <Routes>
      {/* 임시 주석처리: 미로그인 시 로그인페이지로 리다이렉트 */}
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
      <Route path="/profile/change-password" element={<ChangePassword />} />
      <Route path="/Travel" element={<Travel />}></Route>
    </Routes>
    </>
  )
}

export default App

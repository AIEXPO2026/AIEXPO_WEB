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
import SearchResult from './pages/Search/SearchResult'
import SearchResultDetail from './pages/Search/SearchResultDetail'
import ReloadPrompt from './components/ReloadPrompt/ReloadPrompt'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <>
    <ReloadPrompt />
    <Routes>
      <Route path="/" element={<Navigate to={localStorage.getItem('accessToken') ? '/home' : '/login'} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/find-password" element={<FindPassword />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
      <Route path="/community/ranking" element={<PrivateRoute><CommunityRanking /></PrivateRoute>} />
      <Route path="/community/blog" element={<PrivateRoute><CommunityBlog /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/profile/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
      <Route path="/Travel" element={<PrivateRoute><Travel /></PrivateRoute>} />
      <Route path="/search-result" element={<PrivateRoute><SearchResult /></PrivateRoute>} />
      <Route path="/search-result/detail" element={<PrivateRoute><SearchResultDetail /></PrivateRoute>} />
    </Routes>
    </>
  )
}

export default App

import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login/Login'
import Signup from './pages/Auth/Signup/Signup'
import FindPassword from './pages/Auth/FindPassword/FindPassword'
import Welcome from './pages/Auth/Welcome/Welcome'
import Community from './pages/Community/Community'
import CommunityRanking from './pages/Community/Ranking/CommunityRanking'
import CommunityBlog from './pages/Community/Blog/CommunityBlog'
import CommunityBlogDetail from './pages/Community/Blog/CommunityBlogDetail'
import CommunityBlogWrite from './pages/Community/Blog/CommunityBlogWrite'
import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile'
import ChangePassword from './pages/Profile/ChangePassword/ChangePassword'
import Travel from './pages/Travel/Travel'
import AICourse from './pages/Travel/Course/AICourse'
import SearchResult from './pages/Search/SearchResult'
import SearchResultDetail from './pages/Search/SearchResultDetail'
import PaymentPage from './pages/Payment/PaymentPage'
import PaymentSuccessPage from './pages/Payment/PaymentSuccessPage'
import PaymentFailPage from './pages/Payment/PaymentFailPage'
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
        <Route path="/home" element={<Home />} />
        <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
        <Route path="/community/ranking" element={<PrivateRoute><CommunityRanking /></PrivateRoute>} />
        <Route path="/community/blog" element={<PrivateRoute><CommunityBlog /></PrivateRoute>} />
        <Route path="/community/blog/write" element={<PrivateRoute><CommunityBlogWrite /></PrivateRoute>} />
        <Route path="/community/blog/:id" element={<PrivateRoute><CommunityBlogDetail /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/profile/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
        <Route path="/travel" element={<PrivateRoute><Travel /></PrivateRoute>} />
        <Route path="/travel/course" element={<PrivateRoute><AICourse /></PrivateRoute>} />
        <Route path="/search-result" element={<><SearchResult /></>} />
        <Route path="/search-result/detail" element={<><SearchResultDetail /></>} />
        <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
        <Route path="/payment/success" element={<PrivateRoute><PaymentSuccessPage /></PrivateRoute>} />
        <Route path="/payment/fail" element={<PrivateRoute><PaymentFailPage /></PrivateRoute>} />
      </Routes>
    </>
  )
}

export default App
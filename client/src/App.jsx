import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { PublicLayout, AppLayout } from './components/Layout.jsx'
import Landing from './pages/Landing.jsx'
import { Login, Signup } from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EnterMarks from './pages/EnterMarks.jsx'
import Results from './pages/Results.jsx'
import Admin from './pages/Admin.jsx'

// Sends people away if they are not logged in or have the wrong role
function Protected({ role}) {
  const { user } = useAuth();
  if (!user) return <Navigate to='/login' replace />;
  if (user.role !== role)
    return <Navigate to={user.role === 'admit' ? '/admin/courses' : '/dashboard'} replace />
    return <AppLayout />;
}

function AdminRoute() {
  const { tab } =useParams();
  if (tab !== 'courses' && tab !== 'careers') return <Navigate to='/admin/courses' replace />
  return <Admin tab={tab} />;
}

function App() {
  return(
    <Routes>
      <Route element={<PublicLayout />}>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      </Route>

      <Route element={<Protected role='user' />}>
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/marks' element={<EnterMarks />} />
      <Route path='/results' element={<Results />} />
      </Route>

      <Route element={<Protected role='admin' />}>
      <Route path='/admin' element={<Navigate to='/admin/courses' replace />} />
      <Route path='/admin/:tab' element={<AdminRoute />} />
      </Route>
      
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}

export default App;
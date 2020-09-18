import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useRoutes } from './routes'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import {Loader} from './components/Loader'
import {Navbar} from './components/Navbar'
function App() {

  const { token, login, logout, userId , loading } = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  if(!loading) {
    return <Loader />
  }
  return (
    <AuthContext.Provider value={{ token, login, logout, userId }}>
      <BrowserRouter>
      {isAuthenticated && <Navbar />}
        <div className='container w-100' >
          {routes}
        </div>
      </BrowserRouter>
    </AuthContext.Provider>

  );
}

export default App;

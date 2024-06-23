import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { CreatePost } from './pages/create-post/create-post'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/create-post' element={<CreatePost />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

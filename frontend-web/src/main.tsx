import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AddTask from './pages/AddTask'
import EditTask from './pages/EditTask'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/home' element={<HomePage />}/>
      <Route path='/add-task' element={<AddTask />}/>
      <Route path='/edit-task/:id' element={<EditTask />}/>
    </Routes>
  </BrowserRouter>

  // <StrictMode>
  //   <App />
  // </StrictMode>,
)

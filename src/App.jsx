import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Startpage from './Pages/Startpage';
import CaptainRegistration from './Pages/Captain/CaptainRegistration';
import UserRegistration from './Pages/User/UserRegistration';
import { Role } from './Pages/Role';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserLogin from './Pages/User/UserLogin';
import UserHome from './Pages/User/UserHome';
import CaptainLogin from './Pages/Captain/CaptainLogin';
import CaptainHome from './Pages/Captain/CaptainHome';

function App() {

  return (
    <>
    
      <BrowserRouter>
      <ToastContainer />
        <Routes>
          <Route path='/' element={<Startpage/>}/>
          <Route path='/role' element={<Role/>}/>
          <Route path='/captain-registration' element={<CaptainRegistration/>}/>
          <Route path='/user-registration' element={<UserRegistration/>}/>
          <Route path='/user-login' element={<UserLogin/>}/>
          <Route path='/user-home' element={<UserHome/>}/>

          <Route path='/captain-login' element={<CaptainLogin/>}/>
          <Route path='/captain-home' element={<CaptainHome/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

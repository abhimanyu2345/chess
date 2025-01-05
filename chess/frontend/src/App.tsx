
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FrontPage from './screen/FrontPage';
import Game from "./screen/game";
import Signup from './screen/Singup';
import ChessLogin from './screen/Login';
import Dashboard from './screen/dashboard';


function App() {
   

  return (
    <BrowserRouter>
    <Routes>
    <Route path='/home' element={<FrontPage/>}/>
    <Route path='/game' element={<Game/>}/>
    <Route path='/SignUp'element={<Signup/>} />
    <Route path='Login' element={<ChessLogin/>}/>
    <Route path='/dashboard' element={<Dashboard/>} />
    

    </Routes>
    </BrowserRouter>
  )}
export default App;

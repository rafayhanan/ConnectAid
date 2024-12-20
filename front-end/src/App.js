import './App.css';
import {React} from "react";
import NavBar from './components/NavBar';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import DonationCallsList from './pages/DonationCallList';

function App() {
  return (
    <div>
      <Router>
        <div>
          <div className="content">
            <Routes>
              <Route path="/" element={<><NavBar/><Home /></>} />
              <Route path="/login" element={<><NavBar/><Login /></>} />
              <Route path="/signup" element={<><NavBar/><SignUp /></>} />
              <Route path="/donate" element={<DonationCallsList/>}/>
            </Routes>
          </div>
        </div>
      </Router>
    </div>

    
  );
}

export default App;

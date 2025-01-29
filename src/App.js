import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import './css/App.css'
import PaymentFormPage from './pages/PaymentFormPage';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='pagamentos' element={<PaymentFormPage />} />
        </Routes>
      </Router>


    </div>
  );
}

export default App;

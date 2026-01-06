import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import './css/App.css'
import PaymentFormPage from './pages/PaymentFormPage';
import CSVEditorPage from './pages/CSVEditorPage';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='pagamentos' element={<PaymentFormPage />} />
          <Route path='editar-csv' element={<CSVEditorPage />} />
        </Routes>
      </Router>


    </div>
  );
}

export default App;

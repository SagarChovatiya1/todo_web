import React, { useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from './Home/Signup';
import Login from './Home/Login';
import Notify from './Notify';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';
// import { Navigate } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <Routes>
            <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>

        }
        />
      </Routes>
      <Notify />
    </BrowserRouter>
  );
}

export default App;

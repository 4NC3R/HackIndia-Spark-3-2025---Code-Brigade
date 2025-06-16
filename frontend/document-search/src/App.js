import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/landing';
import LoginForm from './components/LoginForm';
import PromptBox from './components/promptbox.jsx';
import useAuthStore from './components/Store';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginForm />} />
        <Route 
          path="/prompt" 
          element={
            <ProtectedRoute>
              <PromptBox />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
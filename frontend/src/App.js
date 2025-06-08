import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import WarningsPage from './pages/WarningsPage/WarningsPage';
import ChatsListPage from './pages/ChatsListPage/ChatsListPage';
import AuthPage from './pages/AuthPage/AuthPage';
import { isAuthenticated } from './services/auth';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated() ? <Navigate to="/main" /> : <Navigate to="/login" />} 
        />
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/main"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        />
        <Route 
          path="/chats" 
          element={
            <PrivateRoute>
              <ChatsListPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/warnings/:chatId" 
          element={
            <PrivateRoute>
              <WarningsPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/warnings" 
          element={
            <PrivateRoute>
              <WarningsPage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
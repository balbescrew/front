import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import WarningsPage from './pages/WarningsPage/WarningsPage';
import ChatsListPage from './pages/ChatsListPage/ChatsListPage';
import AuthPage from './pages/AuthPage/AuthPage';
import UsersPage from './pages/UsersPage/UsersPage';
import UserMessagesPage from './pages/UserMessagesPage/UserMessagesPage';
import { isAuthenticated } from './services/auth';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/main" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } 
        />
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
        <Route 
          path="/users" 
          element={
            <PrivateRoute>
              <UsersPage />
            </PrivateRoute>
          } 
        />
        {/* <Route path="/users/:username" element={<UserMessagesPage />} /> */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './App_ExactMatch.css';

// Simple Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// Components
const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">VeritasAI</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {isAuthenticated && (
            <>
              {(user?.role === 'student' || user?.role === 'admin') && (
                <Link to="/student" className="nav-link">Student</Link>
              )}
              {(user?.role === 'verifier' || user?.role === 'admin') && (
                <Link to="/verifier" className="nav-link">Verifier</Link>
              )}
              {(user?.role === 'institution' || user?.role === 'admin') && (
                <Link to="/institution" className="nav-link">Institution</Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="nav-link">Admin</Link>
              )}
            </>
          )}
          {isAuthenticated ? (
            <div className="user-menu">
              <span>Welcome, {user.name}!</span>
              <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const Home = () => (
  <div className="page-content">
    <div className="container">
      <h1>Welcome to VeritasAI</h1>
      <p>Secure certificate verification using AI and blockchain technology.</p>
    </div>
  </div>
);

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    const userData = {
      id: Date.now(),
      name: email.split('@')[0],
      email,
      role
    };

    login(userData);
    navigate('/');
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="login-container">
          <h1>Login to VeritasAI</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">🎓 Student</option>
                <option value="verifier">🔍 Verifier</option>
                <option value="institution">🏛️ Institution</option>
                <option value="admin">👑 Admin</option>
              </select>
            </div>
            <button type="submit" className="login-submit">Login</button>
          </form>
          <div className="auth-switch">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const userData = {
      id: Date.now(),
      name,
      email,
      role
    };

    login(userData);
    navigate('/');
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="login-container">
          <h1>Join VeritasAI</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">🎓 Student</option>
                <option value="verifier">🔍 Verifier</option>
                <option value="institution">🏛️ Institution</option>
              </select>
            </div>
            <button type="submit" className="login-submit">Create Account</button>
          </form>
          <div className="auth-switch">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentPage = () => (
  <div className="page-content">
    <div className="container">
      <h1>Student Dashboard</h1>
      <p>Verify your certificates here.</p>
    </div>
  </div>
);

const VerifierPage = () => (
  <div className="page-content">
    <div className="container">
      <h1>Verifier Dashboard</h1>
      <p>Verify certificates for authenticity.</p>
    </div>
  </div>
);

const InstitutionPage = () => (
  <div className="page-content">
    <div className="container">
      <h1>Institution Dashboard</h1>
      <p>Upload and manage certificates.</p>
    </div>
  </div>
);

const AdminPage = () => (
  <div className="page-content">
    <div className="container">
      <h1>Admin Dashboard</h1>
      <p>Manage the entire system.</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <div className="page-content">
      <div className="container">
        <h1>🚫 Access Denied</h1>
        <p>Admin access required.</p>
      </div>
    </div>;
  }

  return children;
};

// Main App
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/student" element={
                <ProtectedRoute>
                  <StudentPage />
                </ProtectedRoute>
              } />
              <Route path="/verifier" element={
                <ProtectedRoute>
                  <VerifierPage />
                </ProtectedRoute>
              } />
              <Route path="/institution" element={
                <ProtectedRoute>
                  <InstitutionPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={
                <div className="page-content">
                  <div className="container">
                    <h1>🔍 Page Not Found</h1>
                    <Link to="/">Go Home</Link>
                  </div>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
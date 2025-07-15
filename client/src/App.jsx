import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import PostDetail from './pages/PostDetails';
import Chat from './components/Chat';
import Profile from './pages/Profile';
import MarketPage from './pages/MarketPage';
import UploadProduct from './pages/UploadProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/chatroom" element={<Chat />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/upload" element={<UploadProduct />} />

      </Routes>
    </Router>
  );
}

export default App;

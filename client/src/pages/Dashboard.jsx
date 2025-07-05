import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';


function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [reload, setReload] = useState(false);


  const handlePostCreated = () => {
    setReload(prev => !prev); // trigger PostList refresh
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white shadow p-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-700">AgriConnect Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main className="p-8 text-center">
        <h2 className="text-3xl font-semibold text-green-700 mb-4">Welcome Back, {user?.username || 'User'} !</h2>
        <p className="text-gray-700 text-lg">
          Here you’ll be able to explore posts, chat with others, and share your farming ideas.
        </p>
        <h2 className="text-2xl font-semibold text-green-700 mb-4">Share Your Farming Thoughts</h2>
        <PostForm onPostCreated={handlePostCreated} />
        <PostList key={reload} />
        {/* You can later add post list, chat, profile, etc. here */}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 py-6 bg-green-100 border-t mt-auto">
  <p>
    &copy; {new Date().getFullYear()} AgriConnect. All rights reserved. |
    <a href="/about" className="text-green-700 hover:underline mx-2 inline-block">About</a> |
    <a href="/faq" className="text-green-700 hover:underline mx-2 inline-block">FAQ</a> |
    <a href="/contact" className="text-green-700 hover:underline inline-block">Contact</a>
  </p>
</footer>
    </div>
  );
}

export default Dashboard;

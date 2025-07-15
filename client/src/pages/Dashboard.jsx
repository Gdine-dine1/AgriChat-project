import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import { Link } from 'react-router-dom';



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

<div className="flex items-center gap-4">
  <Link to="/" className="text-green-700 hover:underline">Home</Link>
  <Link to="/market" className="text-green-700 hover:underline">Agriconnect Market</Link>
  </div>
  <div className="relative group">
    <div className="flex items-center gap-2 cursor-pointer">
      <img
        src={`https://ui-avatars.com/api/?name=${JSON.parse(localStorage.getItem("user"))?.username}`}
        alt="avatar"
        className="w-8 h-8 rounded-full border border-green-500"
      />
      <span className="text-green-700 font-medium">
        {JSON.parse(localStorage.getItem("user"))?.username}
      </span>
    </div>

    {/* Dropdown */}
    <div className="absolute right-0 mt-2 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all z-10 min-w-[150px]">
      <Link
        to={`/profile/${JSON.parse(localStorage.getItem("user"))?.id}`}
        className="block px-4 py-2 text-gray-700 hover:bg-green-100"
      >
        View Profile
      </Link>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }}
        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
      >
        Logout
      </button>
    </div>
  </div>
</header>


      {/* Content */}
      <main className="p-8 text-center">
        <h2 className="text-3xl font-semibold text-green-700 mb-4">Welcome Back, {user?.username || 'User'} !</h2>
        <p className="text-gray-700 text-lg">
          Here you’ll be able to explore posts, chat with others, and share your farming ideas.
        </p>
        <p className="text-gray-700 mt-2">
          Connect with your fellow farmers and explow the world of agriculture!. Live chat with them and 
          share your experiences. TO DO SO ENTER THE CHATROOM
        </p>
        
         <Link
          to="/chatroom"
           className="inline-block mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
>
             Enter Chatroom
        </Link>
        <br />
        <h2 className="mt-6 text-2xl font-semibold text-green-700 mb-4">Share Your Farming Thoughts</h2>
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

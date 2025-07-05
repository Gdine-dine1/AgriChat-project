function HomePage() {
  return (
    <div className="min-h-screen bg-green-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow p-4 flex justify-between items-center px-6">
        <h1 className="text-xl font-bold text-green-700">AgriConnect 🌿</h1>
        <nav className="space-x-4">
          <a href="/login" className="text-green-700 hover:underline">Login</a>
          <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Register</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-green-700 mb-4">Welcome to AgriConnect</h2>
            <p className="text-gray-700 text-lg mb-6">
              Join our growing farming community to share knowledge, ask questions, and support one another.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <a
                href="/login"
                className="bg-green-600 text-white px-6 py-2 rounded-lg text-lg hover:bg-green-700 transition duration-200"
              >
                Login
              </a>
              <a
                href="/register"
                className="border border-green-600 text-green-700 px-6 py-2 rounded-lg text-lg hover:bg-green-600 hover:text-white transition duration-200"
              >
                Register
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=700&q=60"
              alt="Farming community"
              className="rounded-2xl w-full object-cover"
            />
          </div>
        </div>
      </main>

      {/* Quote */}
      <section className="text-center px-4 py-10 bg-green-200">
        <blockquote className="italic text-xl text-green-900 max-w-3xl mx-auto">
          "The ultimate goal of farming is not the growing of crops, but the cultivation and perfection of human beings."  
          <br />
          <span className="text-sm block mt-2">— Masanobu Fukuoka</span>
        </blockquote>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-12 px-4">
        <h3 className="text-2xl font-semibold text-center text-green-700 mb-8">What our members say</h3>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Mary W.",
              comment: "AgriConnect helped me solve pest problems and learn new irrigation techniques!",
            },
            {
              name: "James K.",
              comment: "I've connected with experts who helped boost my tomato yields. Great platform!",
            },
            {
              name: "Faith N.",
              comment: "Love the community — it feels like a digital farmers’ market of ideas.",
            },
          ].map((t, i) => (
            <div key={i} className="bg-green-50 p-6 rounded-xl shadow text-gray-700">
              <p className="mb-4">"{t.comment}"</p>
              <div className="text-sm font-semibold text-green-700">— {t.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 py-6 bg-green-100 border-t">
        &copy; {new Date().getFullYear()} AgriConnect. All rights reserved.
      </footer>
    </div>
  );
}

export default HomePage;

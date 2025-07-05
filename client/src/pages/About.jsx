function About() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-xl shadow-md max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-green-700 mb-4">About AgriConnect</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          AgriConnect is a digital platform that empowers farmers and agricultural experts to connect, collaborate, and share innovative farming ideas. 
          <br /><br />
          Whether you’re new to farming or a seasoned expert, AgriConnect provides tools and a community where knowledge grows just like your crops.
          <br /><br />
          Built using the MERN stack, this platform supports real-time interaction, post sharing, and expert Q&A.
        </p>
      </div>
    </div>
  );
}

export default About;

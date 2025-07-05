function FAQ() {
  const faqs = [
    {
      q: "Is AgriConnect free to use?",
      a: "Yes! It’s completely free to sign up, post, and interact with other farmers.",
    },
    {
      q: "Who can join?",
      a: "Anyone interested in agriculture — from small-scale farmers to large agribusiness professionals.",
    },
    {
      q: "Can I post questions and get help?",
      a: "Absolutely. Our platform is designed to help users get answers from peers and experts.",
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((item, index) => (
            <div key={index}>
              <h2 className="text-lg font-semibold text-green-800">{item.q}</h2>
              <p className="text-gray-700 mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;

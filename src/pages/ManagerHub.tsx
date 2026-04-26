import { useState } from 'react';

export default function ManagerHub() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleCoach = async () => {
  if (!input) return;

  setResponse("Thinking...");

  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setResponse(data.text);
  } catch (err) {
    setResponse("Something went wrong.");
  }
};

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Manager Coaching Companion</h1>

      <textarea
        className="w-full p-3 border rounded-lg mb-3"
        rows={4}
        placeholder="Describe what happened in your team..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleCoach}
        className="bg-gold text-navy font-bold px-4 py-2 rounded-lg"
      >
        Get Coaching Insight
      </button>

      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
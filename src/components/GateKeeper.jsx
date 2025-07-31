import React, { useState, useEffect } from "react";

export default function Gatekeeper({ onAccessGranted }) {
  const [nicknameYou, setNicknameYou] = useState("");
  const [nicknameMe, setNicknameMe] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  // ✅ Multiple acceptable names (all lowercase)
  const acceptedNicknamesYou = ["tudkuu", "tudku", "tudu", "baby"];
  const acceptedNicknamesMe = ["piddi", "piddii", "pidii", "love"];

  useEffect(() => {
    const hasAccess = localStorage.getItem("access_granted");
    if (hasAccess) {
      setUnlocked(true);
      onAccessGranted();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userInputYou = nicknameYou.trim().toLowerCase();
    const userInputMe = nicknameMe.trim().toLowerCase();

    const isYouCorrect = acceptedNicknamesYou.includes(userInputYou);
    const isMeCorrect = acceptedNicknamesMe.includes(userInputMe);

    if (isYouCorrect && isMeCorrect) {
      localStorage.setItem("access_granted", "true");
      setUnlocked(true);
      onAccessGranted();
    } else {
      setError("Hmm... one or both answers are not quite right 💭");
    }
  };

  if (unlocked) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-300 via-white to-purple-300 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl p-8 rounded-2xl flex flex-col gap-4 text-center max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold text-pink-600">💘 Just For Us</h2>
        <p className="text-sm text-gray-600">
          Answer these questions to unlock
        </p>

        <div className="flex flex-col text-left">
          <label className="text-sm text-pink-700 font-semibold mb-1">
            What's your nickname?
          </label>
          <input
            type="text"
            value={nicknameYou}
            onChange={(e) => setNicknameYou(e.target.value)}
            className="px-4 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-center"
          />
        </div>

        <div className="flex flex-col text-left">
          <label className="text-sm text-pink-700 font-semibold mb-1">
            What's my nickname?
          </label>
          <input
            type="text"
            value={nicknameMe}
            onChange={(e) => setNicknameMe(e.target.value)}
            className="px-4 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-center"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <button
          type="submit"
          className="mt-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-xl transition"
        >
          Unlock 💖
        </button>
      </form>
    </div>
  );
}

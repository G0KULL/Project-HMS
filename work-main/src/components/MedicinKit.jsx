// src/pages/KitPage.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KitPage() {
  const [kit, setKit] = useState("");
  const [selectedHeader, setSelectedHeader] = useState("Kit"); // ✅ Added missing state
  const navigate = useNavigate();

  const kitOptions = [
    "Post-Op Kit",
    "Glaucoma Kit",
    "Dry Eye Kit",
    "Cataract Kit",
    "Surgical Kit",
  ];

  const handleSave = () => {
    if (!kit) return alert("Please select a kit!");
    alert(`Selected Kit: ${kit}`);
    navigate(-1); // ✅ Go back after saving
  };

  const headers = ["Medicine", "Kit", "Special instruction"];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 overflow-y-auto">
      {/* Main container (wider) */}
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-[900px] relative animate-fadeIn">
        {/* ❌ Close button */}
        <button
          onClick={() => navigate(-1)} // ✅ Go back to previous page
          className="absolute top-4 right-4 text-gray-700 hover:text-black transition"
        >
          <X size={26} />
        </button>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 w-full max-w-3xl mb-6">
          {headers.map((header) => (
            <div
              key={header}
              onClick={() => {
                setSelectedHeader(header);
                if (header === "Special instruction") navigate("/Instruction");
                if (header === "Medicine") navigate("/PrescribeMedi");
              }}
              className={`flex-1 text-center px-4 py-2 cursor-pointer text-base md:text-xl font-semibold border rounded-full transition-all ${
                selectedHeader === header
                  ? "bg-[#F7DACD]"
                  : "bg-white text-black"
              }`}
            >
              {header}
            </div>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-start text-gray-800">
          Select Kit
        </h1>

        {/* 🔽 Kit Dropdown */}
        <div className="w-full flex justify-start">
          <select
            value={kit}
            onChange={(e) => setKit(e.target.value)}
            className="w-[80%] border border-gray-300 rounded-lg p-4 text-lg focus:ring-2 focus:ring-[#7E4363] outline-none"
          >
            <option value="">Select a kit</option>
            {kitOptions.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        {/* 💾 Save Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleSave}
            className="bg-gray-800 text-white px-12 py-3 rounded-full text-lg font-semibold hover:bg-black transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

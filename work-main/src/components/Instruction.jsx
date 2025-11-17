import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Instruction() {
  const [selectedHeader, setSelectedHeader] = useState("Special instruction");
  const navigate = useNavigate();

  const headers = ["Medicine", "Kit", "Special instruction"];

  const leftItems = [
    "AVOID DUST",
    "CONTROL OF DIABETES",
    "SHAKE WELL",
    "COTTON",
    "HOT FOMENTATION",
    "INJ 1",
    "BRING MEDICINE PRESCRIPTION IN NEXT VISIT",
    "DO NOT RUB EYES",
    "CAUTIONED ABOUT STEROIDS",
    "WARM FOMENTATION",
    "PET ANIMALS",
    "CHALAZION",
    "MORNING 10 OR EVENING 5",
  ];

  const rightItems = [
    "INJ2",
    "HOT FOMENTATION",
    "USE PROTECTION GLASSES",
    "MASSAGE",
    "PLANT",
    "ALLERGY",
    "MORNING 9",
    "ALLERGY ENG",
    "LID MASSAGE",
    "CONTINUE OTHER PRESCRIBED MEDICINES",
    "OINTMENT",
    "DUST",
    "COOL EYE MASK",
    "3 TIMES HALF TEASPOON",
    "COLD FOMENTATION",
  ];

  const [checkedLeft, setCheckedLeft] = useState({});
  const [checkedRight, setCheckedRight] = useState({});

  const toggleLeft = (index) =>
    setCheckedLeft((prev) => ({ ...prev, [index]: !prev[index] }));

  const toggleRight = (index) =>
    setCheckedRight((prev) => ({ ...prev, [index]: !prev[index] }));

  // ✅ Submit Function
  const handleSubmit = () => {
    const selected = [
      ...leftItems.filter((_, i) => checkedLeft[i]),
      ...rightItems.filter((_, i) => checkedRight[i]),
    ];
    console.log("Selected Instructions:", selected);
    alert(`Submitted Instructions:\n${selected.join(", ")}`);
    navigate(-1); // Go back after submitting
  };

  // ✅ Close Function
  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="bg-white w-[95%] md:w-[900px] max-h-[90vh] rounded-2xl shadow-2xl p-8 relative animate-fadeIn overflow-hidden"
      >
        {/* ❌ Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <h1 className="text-xl md:text-2xl font-bold mb-4">
          SPECAIAL INSTRUCTION
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 w-full max-w-3xl mb-6">
          {headers.map((header) => (
            <div
              key={header}
              onClick={() => {
                setSelectedHeader(header);
                if (header === "Kit") navigate("/MedicinKit");
                if (header === "Medicine") navigate("/PrescribeMedi");
              }}
              className={`flex-1 text-center px-4 py-2 cursor-pointer text-base md:text-xl font-semibold border rounded-full transition-all ${
                selectedHeader === header
                  ? "bg-[#F7DACD] "
                  : "bg-white text-black"
              }`}
            >
              {header}
            </div>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[60vh] pr-2">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column */}
            <div className="w-full md:w-1/2 p-4 rounded-lg ">
              {leftItems.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={checkedLeft[index] || false}
                    onChange={() => toggleLeft(index)}
                    className="mr-2 w-5 h-5 accent-green-600"
                    id={`left-${index}`}
                  />
                  <label htmlFor={`left-${index}`}>{item}</label>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/2 p-4 rounded-lg">
              {rightItems.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={checkedRight[index] || false}
                    onChange={() => toggleRight(index)}
                    className="mr-2 w-5 h-5 accent-green-600"
                    id={`right-${index}`}
                  />
                  <label htmlFor={`right-${index}`}>{item}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600"
          >
            Submit
          </button>
          <button
            onClick={handleClose}
            className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

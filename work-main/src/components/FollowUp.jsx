import React, { useState, useEffect } from "react";

export default function FollowUp({ onChange }) {
  const [formData, setFormData] = useState({
    nextVisit: "",
    date: "",
    usagePerDay: "",
    transferOutside: false,
    outsideDetails: "",
    dilatation: false,
    rerefraction: false,
    highRiskPatient: false,
    fileClose: false,
    additionalRemarks: "",
    highRiskRemarks: "",
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const updated = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(updated);
    
    // 🔥 FIX: Call onChange immediately when data changes
    if (onChange) {
      onChange(updated);
    }
  };

  const handleSave = () => {
    if (onChange) {
      onChange(formData);
    }
    console.log("Follow-up data saved:", formData);
    alert("Follow-up data saved!");
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-start inline-block bg-[#F7DACD] px-4 py-2 rounded-full mb-6">
        FOLLOW UP
      </h1>

      <div className="flex justify-center items-center py-10">
        <div className="w-full bg-[#F7DACD] p-6 rounded-lg shadow-md">
          {/* Next Visit Info */}
          <div className="grid grid-cols-4 gap-4 text-xl text-start mb-6">
            <h3 className="font-semibold">NEXT VISIT</h3>
            <h3 className="font-semibold">DATE</h3>
            <h3 className="font-semibold col-span-2">USAGE A DAY</h3>

            <input
              type="text"
              name="nextVisit"
              value={formData.nextVisit}
              onChange={handleChange}
              placeholder="Please Select"
              className="bg-white rounded px-2 py-1 w-full h-[53px]"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="bg-white text-gray-500 rounded px-2 py-1 w-full h-[53px]"
            />
            <input
              type="text"
              name="usagePerDay"
              value={formData.usagePerDay}
              onChange={handleChange}
              placeholder="Usage per day"
              className="bg-white rounded px-2 py-1 w-full h-[53px] col-span-2"
            />
          </div>

          {/* Transfer Section */}
          <div className="mb-6">
            <div className="flex flex-wrap text-xl gap-4">
              <p className="font-medium mt-1">Transfer To:</p>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="transferOutside"
                  checked={formData.transferOutside}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#48D56D]"
                />
                <p>Outside</p>
                <input
                  type="text"
                  name="outsideDetails"
                  value={formData.outsideDetails}
                  onChange={handleChange}
                  placeholder="Enter details"
                  className="bg-white rounded px-2 py-1 w-[560px] h-[53px]"
                />
              </div>

              <label className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-[#48D56D] text-white font-medium shadow cursor-pointer hover:bg-green-600 transition">
                <input
                  type="checkbox"
                  name="dilatation"
                  checked={formData.dilatation}
                  onChange={handleChange}
                  className="w-4 h-4 accent-white"
                />
                <span>Dilatation</span>
              </label>

              <label className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-[#48D56D] text-white font-medium shadow cursor-pointer hover:bg-green-600 transition">
                <input
                  type="checkbox"
                  name="rerefraction"
                  checked={formData.rerefraction}
                  onChange={handleChange}
                  className="w-4 h-4 accent-white"
                />
                <span>Re refraction</span>
              </label>

              <label className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-[#48D56D] text-white font-medium shadow cursor-pointer hover:bg-green-600 transition">
                <input
                  type="checkbox"
                  name="highRiskPatient"
                  checked={formData.highRiskPatient}
                  onChange={handleChange}
                  className="w-4 h-4 accent-white"
                />
                <span>High risk patient</span>
              </label>

              <label className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-[#48D56D] text-white font-medium shadow cursor-pointer hover:bg-green-600 transition">
                <input
                  type="checkbox"
                  name="fileClose"
                  checked={formData.fileClose}
                  onChange={handleChange}
                  className="w-4 h-4 accent-white"
                />
                <span>File Close</span>
              </label>
            </div>
          </div>

          {/* Remarks Section */}
          <div className="mb-6 text-xl flex gap-6">
            <div className="flex-1">
              <h2 className="font-semibold">Additional Remarks</h2>
              <textarea
                name="additionalRemarks"
                value={formData.additionalRemarks}
                onChange={handleChange}
                className="w-full h-[143px] bg-white rounded px-3 py-2 mt-1"
              />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">High Risk Remarks</h2>
              <textarea
                name="highRiskRemarks"
                value={formData.highRiskRemarks}
                onChange={handleChange}
                className="w-full h-[143px] bg-white rounded px-3 py-2 mt-1"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-6">
            <button
              type="button"
              className="px-6 py-2 rounded-full bg-[#7E4363] text-white hover:bg-green-600 transition"
              onClick={() => console.log("Load clicked")}
            >
              Load
            </button>
            <button
              type="button"
              className="px-6 py-2 rounded-full bg-[#48D56D] text-white hover:bg-green-600 transition"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
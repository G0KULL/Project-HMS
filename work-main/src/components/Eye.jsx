import React from "react";
import { FiRefreshCw } from "react-icons/fi";

const Eye = ({ data = {}, onChange }) => {
  const testRows = [
    { label: "PUPIL", od: "pupil_od", os: "pupil_os" },
    { label: "CR", od: "cr_od", os: "cr_os" },
    { label: "COVER TEST", od: "cover_od", os: "cover_os" },
    { label: "OM", od: "om_od", os: "om_os" },
    { label: "CONFRONTATION", od: "confrontation_od", os: "confrontation_os" },
    { label: "CONVERGENCE", od: "covergence_od", os: "covergence_os" }, 
  ];

  const extraFields = ["pmt", "dialated", "duochrome", "wfdt"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleReset = () => {
    const empty = {};

    testRows.forEach((r) => {
      empty[r.od] = "";
      empty[r.os] = "";
    });

    extraFields.forEach((f) => (empty[f] = ""));

    onChange(empty);
  };

  return (
    <div className="p-6 space-y-6 relative max-w-8xl mx-auto">

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="absolute top-4 right-4 flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded-md shadow-md"
      >
        <FiRefreshCw size={18} />
        Reset
      </button>

      {/* OD/OS Table */}
      <div className="bg-[#F7DACD] mt-10 p-6 rounded-xl shadow-md overflow-x-auto">

        {/* OD/OS Headings */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <h2 className="text-xl font-bold text-center bg-[#7E4363] text-white py-2 rounded-md">
            OD
          </h2>
          <h2 className="text-xl font-bold text-center bg-[#7E4363] text-white py-2 rounded-md">
            OS
          </h2>
        </div>

        {/* Table Rows */}
        <div className="grid grid-cols-[150px_1fr_1fr] gap-4">
          {testRows.map((row) => (
            <React.Fragment key={row.label}>
              <div className="bg-[#7E4363] text-white font-semibold px-2 py-2 rounded-full text-center">
                {row.label}
              </div>

              <input
                type="text"
                name={row.od}
                value={data[row.od] || ""}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#7E4363] outline-none"
              />

              <input
                type="text"
                name={row.os}
                value={data[row.os] || ""}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#7E4363] outline-none"
              />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        {/* Left */}
        <div className="space-y-4">
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <div className="font-semibold">PMT Needed:</div>
            <input
              type="text"
              name="pmt"
              value={data.pmt || ""}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#7E4363]"
            />
          </div>

          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <div className="font-semibold">Dilated:</div>
            <input
              type="text"
              name="dialated"
              value={data.dialated || ""}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#7E4363]"
            />
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <div className="font-semibold">DuoChrome Test:</div>
            <input
              type="text"
              name="duochrome"
              value={data.duochrome || ""}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#7E4363]"
            />
          </div>

          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <div className="font-semibold">WFDT:</div>
            <input
              type="text"
              name="wfdt"
              value={data.wfdt || ""}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#7E4363]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eye;

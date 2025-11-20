import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddMedicine() {
  const navigate = useNavigate();

  const companies = ["Sun Pharma", "Cipla"];

  const categories = [
    "Tablet",
    "Capsule",
    "Drop",
    "Ointment",
    "Injection",
    "Syrup",
  ];

  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    genericName: "",
    category: "",
    description: "",

    strength: "",
    dosage: "",
    manufacturer: "",
    chemical: "",
    remarks: "",

    document: null, // 📌 NEW FIELD
  });

  // Handle Value Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Document Upload
  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, document: file });
  };

  // Save Button Logic
  const handleSave = () => {
    const required = [
      "name",
      "genericName",
      "category",
      "strength",
      "dosage",
      "manufacturer",
    ];

    for (let item of required) {
      if (!formData[item]) {
        alert("Please fill all required fields!");
        return;
      }
    }

    console.log("Saved Medicine:", formData);
    alert("Medicine saved successfully!");
    navigate("/medicinepage");
  };

  const handleCancel = () => navigate("/medicinepage");

  return (
    <div className="max-w-8xl mx-auto p-8 mt-10">
      <h2 className="text-3xl font-bold mb-6">Add New Medicine</h2>

      {/* SECTION 1 — BASIC INFORMATION */}
      <div className="bg-[#F7DACD] p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <p>Medicine Name</p>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>

        <div>
          <p>Generic Name</p>
          <input
            name="genericName"
            value={formData.genericName}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>

        {/* CATEGORY DROPDOWN */}
        <div>
          <p>Category</p>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
         <div>
          <p>Strength</p>
          <input
            name="strength"
            value={formData.strength}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="md:col-span-2">
          <p>Description</p>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 rounded h-24"
          ></textarea>
        </div>

       

        <div>
          <p>Dosage</p>
          <input
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>

        <div>
          <p>Manufacturer</p>
          <input
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>

        <div>
          <p>Chemical</p>
          <input
            name="chemical"
            value={formData.chemical}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>

        {/* 📄 DOCUMENT UPLOAD SECTION */}
        <div>
          <p>Upload Document <span className="text-gray-500">(Optional)</span></p>

          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={handleDocumentUpload}
            className="w-full p-2 rounded bg-white"
          />

          {formData.document && (
            <p className="mt-2 text-sm text-green-700">
              Uploaded: {formData.document.name}
            </p>
          )}
        </div>

        {/* REMARKS */}
        <div className="md:col-span-2">
          <p>Remarks</p>
          <input
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="w-full h-24 p-2 rounded"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          className="bg-green-600 text-white px-6 py-2 rounded"
          onClick={handleSave}
        >
          Save Medicine
        </button>

        <button
          className="bg-red-600 text-white px-6 py-2 rounded"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

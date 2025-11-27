import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AddMedicine() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingMedicine = location.state?.medicine || null;

  const categories = [
    "Tablet",
    "Capsule",
    "Drop",
    "Ointment",
    "Injection",
    "Syrup",
  ];

  const [showFileUpload, setShowFileUpload] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    genericname: "",
    entrydate: "",     
    expireddate: "", 
    category: "",
    description: "",
    strength: "",
    dosage: "",
    manufacturer: "",
    chemical: "",
    remarks: "",
    document: null, // file object only if user uploads
  });

  // Prefill data when editing
  useEffect(() => {
    if (editingMedicine) {
      setFormData({
        companyName: editingMedicine.companyName || "",
        name: editingMedicine.name || "",
        genericname: editingMedicine.genericname || "",
        entrydate: editingMedicine.entrydate || "",
        expireddate: editingMedicine.expireddate || "",
        category: editingMedicine.category || "",
        description: editingMedicine.description || "",
        strength: editingMedicine.strength || "",
        dosage: editingMedicine.dosage || "",
        manufacturer: editingMedicine.manufacturer || "",
        chemical: editingMedicine.chemical || "",
        remarks: editingMedicine.remarks || "",
        document: null, // keep null initially
      });
    }
  }, [editingMedicine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, document: file });
  };

  // Save / Update
  const handleSave = async () => {
    const required = ["name", "genericname","entrydate", "expireddate", "category", "strength", "dosage", "manufacturer"];
    for (let field of required) {
      if (!formData[field]) {
        alert("Please fill all required fields!");
        return;
      }
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "document") {
        if (formData.document) formDataToSend.append("document", formData.document);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const url = editingMedicine
        ? `http://127.0.0.1:8000/medicines/${editingMedicine.id}`
        : "http://127.0.0.1:8000/medicines/";

      const method = editingMedicine ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("Failed to save medicine");

      alert(editingMedicine ? "Medicine updated successfully!" : "Medicine added successfully!");
      navigate("/medicinepage");

    } catch (err) {
      console.error(err);
      alert("Error saving medicine!");
    }
  };

  const handleCancel = () => navigate("/medicinepage");

  return (
    <div className="max-w-8xl mx-auto p-8 mt-10">
      <h2 className="text-3xl font-bold mb-6">
        {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
      </h2>

      <div className="bg-[#F7DACD] p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <p>Medicine Name</p>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded" />
        </div>

        <div>
          <p>Generic Name</p>
          <input name="genericname" value={formData.genericname} onChange={handleChange} className="w-full p-2 rounded" />
        </div>
        <div>
          <p>Entry Date</p>
          <input type="date" name="entrydate" value={formData.entrydate} onChange={handleChange} className="w-full p-2 rounded"/>
        </div>

        <div>
          <p>Expired Date</p>
          <input type="date" name="expireddate" value={formData.expireddate} onChange={handleChange} className="w-full p-2 rounded"/>
        </div>

        <div>
          <p>Category</p>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 rounded">
            <option value="">Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <p>Strength</p>
          <input name="strength" value={formData.strength} onChange={handleChange} className="w-full p-2 rounded" />
        </div>

        <div className="md:col-span-2">
          <p>Description</p>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 rounded h-24" />
        </div>

        <div>
          <p>Dosage</p>
          <input name="dosage" value={formData.dosage} onChange={handleChange} className="w-full p-2 rounded" />
        </div>

        <div>
          <p>Manufacturer</p>
          <input name="manufacturer" value={formData.manufacturer} onChange={handleChange} className="w-full p-2 rounded" />
        </div>

        <div>
          <p>Chemical</p>
          <input name="chemical" value={formData.chemical} onChange={handleChange} className="w-full p-2 rounded" />
        </div>

        {/* DOCUMENT HANDLING */}
        <div>
          <p>Document</p>

          {!showFileUpload && editingMedicine && editingMedicine.document ? (
            <div className="p-3 bg-white rounded shadow-sm">
              <p className="text-green-700 text-sm">Document already uploaded</p>

              <button
                onClick={() => setShowFileUpload(true)}
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
              >
                Edit Document
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        <div className="md:col-span-2">
          <p>Remarks</p>
          <input name="remarks" value={formData.remarks} onChange={handleChange} className="w-full h-24 p-2 rounded" />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button className="bg-green-600 text-white px-6 py-2 rounded" onClick={handleSave}>
          {editingMedicine ? "Update Medicine" : "Save Medicine"}
        </button>
        <button className="bg-red-600 text-white px-6 py-2 rounded" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

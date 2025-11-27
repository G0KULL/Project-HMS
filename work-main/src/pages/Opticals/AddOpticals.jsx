import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddOpticals() {
  const navigate = useNavigate();

  const categories = [
    "Lenses",
    "Frames",
    "Others",
    "Contact Lenses",
    "Solution",
  ];

  const [brands, setBrands] = useState([
    { id: 1, name: "RayBan" },
    { id: 2, name: "Johnson & Johnson" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    tax: "",
    supplier: "",
    hsn: "",
    remarks: "",
  });

  const [newBrand, setNewBrand] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddBrand = () => {
    if (!newBrand.trim()) {
      alert("Brand name cannot be empty.");
      return;
    }

    const id = brands.length + 1;
    const obj = { id, name: newBrand };

    setBrands([...brands, obj]);
    setFormData({ ...formData, brand: newBrand });

    setNewBrand("");
    setShowModal(false);
  };

  const handleSave = () => {
    const required = ["name", "category", "brand"];
    for (let r of required) {
      if (!formData[r]) {
        alert("Please fill all required fields!");
        return;
      }
    }
    alert("Item saved!");
    navigate("/opticalspage");
  };

  return (
    <div className="max-w-8xl mx-auto p-8 mt-10">
      <h2 className="text-3xl font-bold mb-6">Optical Item Master</h2>

      {/* FORM */}
      <div className="bg-[#F7DACD] p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <p>Item Name*</p>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>

        <div>
          <p>Category*</p>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* BRAND WITH + BUTTON */}
        <div>
          <p>Brand*</p>

          <div className="flex gap-2">
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full p-2 rounded"
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-black px-4 py-2 rounded text-xl font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <p>Tax</p>
          <input
            name="tax"
            value={formData.tax}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>

        <div>
          <p>Supplier</p>
          <input
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>

        <div>
          <p>HSN Code</p>
          <input
            name="hsn"
            value={formData.hsn}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>

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

      {/* SAVE/CANCEL */}
      <div className="flex gap-4 mt-6">
        <button
          className="bg-green-600 text-white px-6 py-2 rounded"
          onClick={handleSave}
        >
          Save Item
        </button>

        <button
          className="bg-red-600 text-white px-6 py-2 rounded"
          onClick={() => navigate("/opticalspage")}
        >
          Cancel
        </button>
      </div>

      {/* ===== MODAL POPUP ===== */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">

          <div className="bg-[#F7DACD] w-96 p-6 rounded-xl shadow-lg relative">

            <h3 className="text-xl font-bold mb-4 text-black-700">Brand Master</h3>

            <div className="mb-3">
              <p>Serial No</p>
              <input
                disabled
                value={brands.length + 1}
                className="w-full p-2 border rounded bg-gray-200"
              />
            </div>

            <div className="mb-3">
              <p>Brand Name</p>
              <input
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleAddBrand}
              >
                Add
              </button>

              <button
                className="bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>

            {/* BRAND LIST INSIDE MODAL */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Existing Brands</h4>
              <div className="max-h-40 overflow-y-auto border rounded">
                <table className="w-full text-left">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-2 border">S.No</th>
                      <th className="p-2 border">Brand</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((b) => (
                      <tr key={b.id}>
                        <td className="p-2 border">{b.id}</td>
                        <td className="p-2 border">{b.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

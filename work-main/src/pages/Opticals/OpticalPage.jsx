import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";

export default function OpticalPage() {
  const navigate = useNavigate();

  // Sample data (replace with API later)
  const [opticals, setOpticals] = useState([
    {
      id: 1,
      name: "39098 Glasses",
      category: "Lenses",
      brand: "RayBan",
    },
    {
      id: 2,
      name: "7016 Frames",
      category: "Frames",
      brand: "Silhouette",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Filter Logic
  const filteredMedicines = opticals.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase());

    const matchCategory = filterCategory ? m.category === filterCategory : true;

    return matchSearch && matchCategory;
  });

  // Delete function
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setOpticals(opticals.filter((m) => m.id !== id));
    }
  };

  // View function
  const handleView = (medicine) => {
    navigate("/ViewMedicine", { state: { medicine } });
  };

  // Edit function
  const handleEdit = (medicine) => {
    navigate("/AddOpticals", { state: { medicine } });
  };

  return (
    <div className="max-w-8xl mx-auto p-8 mt-10">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Opticals List</h2>

        <button
          onClick={() => navigate("/AddOpticals")}
          className="bg-[#7E4363]  text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} /> Add Opticals
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className=" bg-[#7E4363] h-16 text-lg text-white text-left">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Item Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Brand</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMedicines.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No Items found
                </td>
              </tr>
            ) : (
              filteredMedicines.map((m) => (
                <tr key={m.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{m.id}</td>
                  <td className="px-4 py-2">{m.name}</td>
                  <td className="px-4 py-2">{m.category}</td>
                  <td className="px-4 py-2">{m.brand}</td>

                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-4">

                      {/* View Button */}
                      <button
                        onClick={() => handleView(m)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye size={20} />
                      </button>

                      <button
                        onClick={() => handleEdit(m)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={20} />
                      </button>

                    
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

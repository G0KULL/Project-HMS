import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SupplierTable = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:8000/suppliers/");
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);
  
  // Toggle status function
  const toggleStatus = (id) => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === id ? { ...supplier, status: !supplier.status } : supplier
      )
    );
  };

  return (
    <div className="p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between mt-8 items-center mb-4">
        <h1 className="text-3xl font-bold">Supplier Table</h1>
        <button
          onClick={() => navigate("/AddSupplier")}
          className="bg-[#7E4363] text-white text-xl px-4 py-4 rounded-lg hover:bg-[#9b5778]"
        >
          + Add Supplier
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-4 h-[129px] text-lg">
          <thead className="bg-[#7E4363]  text-white">
            <tr>
              <th className="px-4 py-4 text-center">Supplier ID</th>
              <th className="px-4 py-4 text-center">Company Name</th>
              <th className="px-4 py-4 text-center">Contact Person</th>
              <th className="px-4 py-4 text-center">Phone</th>
              <th className="px-4 py-4 text-center">Email</th>
              <th className="px-4 py-4 text-center">Address</th>
              <th className="px-4 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="border-b text-lg hover:bg-gray-100"
              >
                <td className="px-4 py-4 text-center">{supplier.id}</td>
                <td className="px-4 py-4 text-center">{supplier.companyname}</td>
                <td className="px-4 py-4 text-center">{supplier.contactPerson}</td>
                <td className="px-4 py-4 text-center">{supplier.phone}</td>
                <td className="px-4 py-4 text-center">{supplier.email}</td>
                <td className="px-4 py-4 text-center">{supplier.address}</td>
                <td className="px-4 py-4 text-center">
                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={supplier.status}
                      onChange={() => toggleStatus(supplier.id)}
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-green-500 transition"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierTable;

import React, { useState } from "react";
import TotalIcon from "../../../public/icons/TotalIcon.png";
import LowIcon from "../../../public/icons/Lowicon.png";
import ExpiryIcon from "../../../public/icons/ExpiryIcon.png";
import OutIcon from "../../../public/icons/OutIcon.png";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiEdit, FiEye, FiTrash2 } from "react-icons/fi";


// ---------------------------------------------
//   SUPPLIER / INVENTORY TABLE COMPONENT
// ---------------------------------------------
function SupplierTable({ suppliers, deleteItem, navigate }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-4 text-lg">
        <thead className="bg-gray-800 h-[129px] text-white">
          <tr>
            <th className="px-6 py-3 text-left">Serial No</th>
            <th className="px-6 py-3 text-left">Supplier Name</th>
            <th className="px-6 py-3 text-left">Invoice ID</th>
            <th className="px-6 py-3 text-left">Date</th>
            <th className="px-6 py-3 text-left">Total Amt</th>
            <th className="px-6 py-3 text-left">Paid Amt</th>
            <th className="px-6 py-3 text-left">Credit</th>
            <th className="px-6 py-3 text-center">Mode</th>
            <th className="px-6 py-3 text-center">Purchase Type</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((supplier) => (
            <tr
              key={supplier.id}
              className="bg-[#CBDCEB] h-[122px] shadow-md rounded-lg"
            >
              <td className="px-6 py-4 font-medium">{supplier.id}</td>
              <td className="px-6 py-4">{supplier.supplierName}</td>
              <td className="px-6 py-4">{supplier.invoiceId}</td>
              <td className="px-6 py-4">{supplier.date}</td>
              <td className="px-6 py-4">{supplier.totalAmount}</td>
              <td className="px-6 py-4">{supplier.paidAmount}</td>
              <td className="px-6 py-4">{supplier.credit}</td>
              <td className="px-6 py-4 text-center">{supplier.mode}</td>
              <td className="px-6 py-4 text-center">{supplier.purchaseType}</td>

              <td className="px-6 py-4 flex justify-center gap-4">
                {/* Edit Icon */}
                <FiEdit
                  className="text-blue-600 cursor-pointer hover:scale-110"
                  onClick={() => navigate(`/InventoryItems/${supplier.id}`)}
                />

                {/* View Icon */}
                <FiEye
                  className="text-green-600 cursor-pointer hover:scale-110"
                  onClick={() => navigate(`/view-item/${supplier.id}`)}
                />

                {/* Delete Icon */}
                <FiTrash2
                  className="text-red-600 cursor-pointer hover:scale-110"
                  onClick={() => deleteItem(supplier.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



// ---------------------------------------------
//           MAIN INVENTORY PAGE
// ---------------------------------------------
const InventoryManag = () => {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([
    {
      id: "1",
      supplierName: "ABC Medicals",
      invoiceId: "INV-001",
      date: "2025-08-18",
      totalAmount: 5000,
      paidAmount: 3000,
      credit: 2000,
      mode: "Cash",
      purchaseType: "Cash Purchase",
    },
    {
      id: "2",
      supplierName: "XYZ Pharma",
      invoiceId: "INV-002",
      date: "2025-08-10",
      totalAmount: 8200,
      paidAmount: 5000,
      credit: 3200,
      mode: "Online",
      purchaseType: "Credit Purchase",
    },
    {
      id: "3",
      supplierName: "HealthCare Store",
      invoiceId: "INV-003",
      date: "2025-08-12",
      totalAmount: 3000,
      paidAmount: 3000,
      credit: 0,
      mode: "Cash",
      purchaseType: "Cash Purchase",
    }
  ]);

  // Delete item
  const deleteItem = (id) => {
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
  };


  return (
    <div className="p-8">
    
      <h1 className="text-3xl font-bold mb-6">
        INVENTORY MANAGEMENT SYSTEM
      </h1>

      {/* --------------------------------------------- */}
      {/*                SUMMARY CARDS                  */}
      {/* --------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        {/* Total Items */}
        <div className="bg-[#CBDCEB] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="bg-[#96E8B699] rounded-full w-[60px] h-[60px] flex justify-center items-center">
              <img src={TotalIcon} alt="" />
            </div>
            <h1 className="text-lg font-bold">Total Items</h1>
          </div>
          <p className="text-lg mt-1">Total Items in Stock</p>
          <h1 className="text-2xl font-extrabold mt-4 text-right">370</h1>
        </div>

        {/* Low Stock */}
        <div className="bg-[#CBDCEB] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="bg-[#F6FF0059] rounded-full w-[60px] h-[60px] flex justify-center items-center">
              <img src={LowIcon} alt="" />
            </div>
            <h1 className="text-lg font-bold">Low Stock Items</h1>
          </div>
          <p className="text-lg mt-1">Number of items that are running low</p>
          <h1 className="text-2xl font-extrabold mt-4 text-right">8</h1>
        </div>

        {/* Expired Items */}
        <div className="bg-[#CBDCEB] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF9C9C] rounded-full w-[60px] h-[60px] flex justify-center items-center">
              <img src={ExpiryIcon} alt="" />
            </div>
            <h1 className="text-lg font-bold">Expired Items</h1>
          </div>
          <p className="text-lg mt-1">Number of items past expiration date</p>
          <h1 className="text-2xl font-extrabold mt-4 text-right">6</h1>
        </div>

        {/* Out of Stock */}
        <div className="bg-[#CBDCEB] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="bg-[#00000061] rounded-full w-[60px] h-[60px] flex justify-center items-center">
              <img src={OutIcon} alt="" />
            </div>
            <h1 className="text-lg font-bold">Out of Stock</h1>
          </div>
          <p className="text-lg mt-1">Items currently out of stock</p>
          <h1 className="text-2xl font-extrabold mt-4 text-right">20</h1>
        </div>
      </div>



      <h1 className="text-3xl font-semibold mb-4">
        Complete Hospital Inventory Table
      </h1>

      
      <div className="flex justify-end items-center gap-4 mb-4">
     
        <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm w-1/3">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="outline-none flex-1 text-gray-700"
          />
        </div>

        {/* Add Item */}
        <button
          onClick={() => navigate("/InventoryItems")}
          className="bg-green-600 text-xl text-white px-5 py-2 rounded-full font-semibold"
        >
          + Add Item
        </button>
      </div>

      {/* TABLE */}
      <SupplierTable
        suppliers={suppliers}
        deleteItem={deleteItem}
        navigate={navigate}
      />
    </div>
  );
};

export default InventoryManag;

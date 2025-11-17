import React, { useState, useEffect } from "react";
import { Edit, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MedicinKit from "./MedicinKit";
import Instruciton from "./Instruction";

const PrescribeMedi = ({ onClose }) => {
  const [selectedHeader, setSelectedHeader] = useState("");
  const [category, setCategory] = useState("ALL");
  const [dosage, setDosage] = useState("");
  const [itemName, setItemName] = useState("");
  const [form, setForm] = useState({
    frequency: "",
    duration: "",
    route: "",
    quantity: "",
    startDate: "",
    endDate: "",
  });

  const [medicines, setMedicines] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const headers = ["Medicine", "Kit", "Special instruction"];
  const categories = [
    "ALL",
    "NSAID",
    "ANTI BACTERIAL",
    "VITAMINS",
    "GLAUCOMA",
    "LUBRICANT",
    "ANTIOXIDANT",
  ];
  const dosages = [
    "2 TIME TILL ONE BOTTLE",
    "3 TIMES LIFE LONG",
    "3-2-0",
    "3 TIMES ONE TEASPOON",
    "2-2-0",
    "1-1-0",
    "NIGHT ONE TUBE",
  ];

  const navigate = useNavigate();

  // Make body unscrollable while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMedicine = () => {
    if (!itemName || !dosage || !form.duration || !form.route || !form.quantity) {
      alert("Please fill all required fields!");
      return;
    }

    const newMedicine = {
      category,
      itemName,
      dosage,
      frequency: form.frequency,
      duration: form.duration,
      route: form.route,
      quantity: form.quantity,
      startDate: form.startDate,
      endDate: form.endDate,
    };

    if (editIndex !== null) {
      const updated = [...medicines];
      updated[editIndex] = newMedicine;
      setMedicines(updated);
      setEditIndex(null);
    } else {
      setMedicines([...medicines, newMedicine]);
    }

    // Reset
    setCategory("ALL");
    setDosage("");
    setItemName("");
    setForm({
      frequency: "",
      duration: "",
      route: "",
      quantity: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleEdit = (index) => {
    const med = medicines[index];
    setCategory(med.category);
    setDosage(med.dosage);
    setItemName(med.itemName);
    setForm({
      frequency: med.frequency,
      duration: med.duration,
      route: med.route,
      quantity: med.quantity,
      startDate: med.startDate,
      endDate: med.endDate,
    });
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
  };

  // ✅ Robust close function
  const close = () => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      navigate(-1); // fallback if onClose is missing
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pt-20">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-gray-200/30 z-0"
        onClick={close} // uses robust close
      />

      {/* Modal content */}
      <div
        className="relative z-10 w-full max-w-8xl p-6 bg-white rounded-2xl overflow-y-auto max-h-[90vh] space-y-6 shadow-lg"
        onClick={(e) => e.stopPropagation()} // prevent backdrop close
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">PRESCRIBE MEDICINE</h1>
          <button
            type="button"
            onClick={close} // robust close
            className="text-gray-600 hover:text-red-600 transition"
          >
            <X size={26} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 w-full max-w-3xl mb-6">
          {headers.map((header) => (
            <div
              key={header}
              onClick={() => {
                setSelectedHeader(header);
                if (header === "Kit") navigate("/MedicinKit");
                if (header === "Special instruction") navigate("/Instruciton");
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
        {/* Input Section */}
        <div className="p-6 bg-[#F7DACD] rounded-2xl space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-semibold mb-1">CATEGORY</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white rounded-full px-3 py-2"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="font-semibold mb-1">ITEM NAME</p>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full bg-white rounded-full px-3 py-2"
              />
            </div>
            <div>
              <p className="font-semibold mb-1">DOSAGE</p>
              <select
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full bg-white rounded-full px-3 py-2"
              >
                <option value="">Select dosage</option>
                {dosages.map((dose) => (
                  <option key={dose} value={dose}>
                    {dose}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["frequency", "duration", "route"].map((key) => (
              <div key={key}>
                <p className="font-semibold mb-1">{key.toUpperCase()}</p>
                <input
                  type="text"
                  name={key}
                  value={form[key]}
                  onChange={handleInputChange}
                  placeholder={`Enter ${key}`}
                  className="w-full bg-white rounded-full px-3 py-2"
                />
              </div>
            ))}
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["quantity", "startDate", "endDate"].map((key) => (
              <div key={key}>
                <p className="font-semibold mb-1">
                  {key.replace("Date", " DATE").toUpperCase()}
                </p>
                <input
                  type={key.includes("Date") ? "date" : "text"}
                  name={key}
                  value={form[key]}
                  onChange={handleInputChange}
                  placeholder={key === "quantity" ? "Enter quantity" : ""}
                  className="w-full bg-white rounded-full px-3 py-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-4 space-x-4">
          <button
            type="button"
            onClick={handleAddMedicine}
            className="bg-green-500 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-green-600 text-sm md:text-base"
          >
            {editIndex !== null ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={close} // robust close
            className="bg-red-500 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-red-600 text-sm md:text-base"
          >
            Cancel
          </button>
        </div>

        {/* Medicine Table */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full rounded-lg text-sm md:text-base border border-gray-300">
            <thead className="bg-black text-white">
              <tr>
                {[
                  "MEDICINE",
                  "DOSAGE",
                  "DURATION",
                  "QUANTITY",
                  "ROUTE",
                  "START DATE",
                  "END DATE",
                  "ACTION",
                ].map((head) => (
                  <th key={head} className="px-4 py-2">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {medicines.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No medicines added yet.
                  </td>
                </tr>
              ) : (
                medicines.map((med, index) => (
                  <tr key={index} className="text-center border-t">
                    <td className="px-4 py-2">{med.itemName}</td>
                    <td className="px-4 py-2">{med.dosage}</td>
                    <td className="px-4 py-2">{med.duration}</td>
                    <td className="px-4 py-2">{med.quantity}</td>
                    <td className="px-4 py-2">{med.route}</td>
                    <td className="px-4 py-2">{med.startDate}</td>
                    <td className="px-4 py-2">{med.endDate}</td>
                    <td className="px-4 py-2 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrescribeMedi;

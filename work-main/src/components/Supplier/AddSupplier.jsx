import React, { useState } from "react";

const AddSupplierForm = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Gender: "",
    dob: "",
    regno: "",
    bloodgroup: "",
    age: "",
    contact: "",
    email: "",
    address: "",
    aadhaar: null,
    license: null,
  });

    const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false); // state for popup

  const API_URL = "http://localhost:8000/suppliers/";

  const validateFields = (formData) => {
  let errors = {};

  // Required check
  const requiredFields = [
    "company_name",
    "supplier_name",
    "phone",
    "email",
    "gst_number",
    "pan_number",
    "address",
  ];

  requiredFields.forEach((field) => {
    if (!formData[field] || formData[field].trim() === "") {
      errors[field] = "This field is required";
    }
  });

  // Phone: 10 digits only
  if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
    errors.phone = "Enter a valid 10-digit mobile number";
  }

  // Email format
  if (
    formData.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    errors.email = "Enter a valid email address";
  }

  // GST number format: 15 chars, uppercase letters + digits
  if (
    formData.gst_number &&
    !/^[0-9A-Z]{15}$/.test(formData.gst_number)
  ) {
    errors.gst_number = "Invalid GST Number (must be 15 characters)";
  }

  // PAN format: 5 letters + 4 digits + 1 letter → ABCDE1234F
  if (
    formData.pan_number &&
    !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number)
  ) {
    errors.pan_number = "Invalid PAN Number (Format: ABCDE1234F)";
  }

  return errors;
};


  // Handle input change
  const handleChange = (e) => {
    const { name, value ,files} = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors({ ...errors, [name]: "" });

  };

  // Handle submit
  const handleSubmit = async(e) => {
    e.preventDefault();
    let newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      if (!formData[field] || formData[field] === "") {
        newErrors[field] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Prepare FormData for backend
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Also pass user_id (required in backend)
      data.append("user_id", 1); // Replace with actual logged in user ID

      const response = await  fetch(API_URL, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        setShowPopup(true);
      } else {
        alert("Error submitting form");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      Name: "",
      Gender: "",
      dob: "",
      regno: "",
      bloodgroup: "",
      age: "",
      contact: "",
      email: "",
      address: "",
      aadhaar: null,
      license: null,
    });
    setErrors({});
  };

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <h1 className="text-3xl font-bold  mb-6">Add Supplier</h1>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-[#F7DACD] p-10">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block font-medium">Full Name*</label>
            <input
              type="text"
              name="Name"
              value={formData["Name"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["Name"] && (
              <p className="text-red-500 text-sm">{errors["Name"]}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Gender*</label>
            <select
              name="Gender"
              value={formData.Gender}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            {errors.Gender && (
              <p className="text-red-500 text-sm">{errors.Gender}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Date of Birth*</label>
            <input
              type="date"
              name="dob"
              value={formData["dob"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["dob"] && (
              <p className="text-red-500 text-sm">{errors["dob"]}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Registration No.*</label>
            <input
              type="text"
              name="regno"
              value={formData["regno"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["regno"] && (
              <p className="text-red-500 text-sm">
                {errors["regno"]}
              </p>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block font-medium">Blood Group</label>
            <input
              type="text"
              name="bloodgroup"
              value={formData["bloodgroup"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["bloodgroup"] && (
              <p className="text-red-500 text-sm">{errors["bloodgroup"]}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={formData["age"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["age"] && (
              <p className="text-red-500 text-sm">{errors["age"]}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Contact Number</label>
            <input
              type="text"
              name="contact"
              value={formData["contact"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["contact"] && (
              <p className="text-red-500 text-sm">{errors["contact"]}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData["email"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["email"] && (
              <p className="text-red-500 text-sm">{errors["email"]}</p>
            )}
          </div>
        </div>

        {/* Row 3 - Single full width */}
        <div>
          <label className="block font-medium">Address*</label>
          <textarea
            name="address"
            value={formData["address"]}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            rows="3"
          />
          {errors["address"] && (
            <p className="text-red-500 text-sm">{errors["address"]}</p>
          )}
        </div>

       {/* Row 4 - Left side 2 file uploads */}
         {/* Row 4 - Left side 2 file uploads */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-1/2">
  {/* Aadhaar Card Upload */}
  <div>
    <label className="block font-medium mb-1">Upload Aadhaar</label>
    <label className="flex flex-col items-center justify-center border border-gray-300 rounded-lg px-3 py-6 cursor-pointer bg-white hover:bg-gray-50 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-gray-400 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0 0l-3-3m3 3l3-3M12 4v8" />
      </svg>
      <span className="text-gray-500 text-sm">File upload (PDF/JPG/PNG)</span>
      <input 
        type="file"
        name="aadhaar"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleChange}
        className="hidden"
      />
    </label>
    {errors["aadhaar"] && (
      <p className="text-red-500 text-sm mt-1">{errors["aadhaar"]}</p>
    )}
  </div>

  {/* Driving License Upload */}
  <div>
    <label className="block font-medium mb-1">Upload Driving License</label>
    <label className="flex flex-col items-center justify-center border border-gray-300 rounded-lg px-3 py-6 cursor-pointer bg-white hover:bg-gray-50 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-gray-400 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0 0l-3-3m3 3l3-3M12 4v8" />
      </svg>
      <span className="text-gray-500 text-sm">File upload (PDF/JPG/PNG)</span>
      <input 
        type="file"
        name="license"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleChange}
        className="hidden"
      />
    </label>
    {errors["license"] && (
      <p className="text-red-500 text-sm mt-1">{errors["license"]}</p>
    )}
  </div>
</div>



        
      </form>

      
      {/* Centered Submit and Cancel buttons in 2 lines */}
      <div className="flex flex-col items-center gap-4 mt-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-green-400 text-white w-[600px] px-8 py-3 rounded-lg font-semibold hover:bg-[#5679a8] text-[40px] transition h-[74px] text-center"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-red-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition w-[600px] text-[40px] h-[74px] text-center"
        >
          Cancel
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 relative flex flex-col items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/845/845646.png" // Example image
              alt="Success"
              className="w-40 h-40 mb-4"
            />
            <p className="text-xl font-semibold mb-4">Supplier Added Successfully!</p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddSupplierForm;

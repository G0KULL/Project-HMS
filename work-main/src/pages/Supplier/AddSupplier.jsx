import React, { useState } from "react";

const AddSupplierForm = () => {
  const [formData, setFormData] = useState({
    companyname: "",
    phone: "",
    email: "",
    address: "",
    gst_number: "",
    license: null,
    description: "",
    contactPerson: "",
    website: "",
  });

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const API_URL = "http://localhost:8000/suppliers/";

  const validateForm = () => {
    const newErrors = {};

    if(!formData.contactPerson) {
      newErrors.contactPerson = "Contact Person is required";
    } 
    if (!formData.companyname) {
      newErrors.companyname = "Company Name is required";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?\d{0,4}?[-\s()]?\d{6,15}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Enter a valid phone number (with optional +country code, spaces, or dashes)";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        [name]: file,
        filePreview: URL.createObjectURL(file),
        fileType: file.type,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      alert("Please fix validation errors before submitting.");
      return;
    }

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

      const userId = parseInt(localStorage.getItem("user_id") || "0");
      data.append("user_id", userId);

      const response = await fetch(API_URL, {
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
      companyname: "",
      phone: "",
      email: "",
      address: "",
      gst_number: "",
      description: "",
      contactPerson: "",
      license: null,
      website: "",
    });
    setErrors({});
  };

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <h1 className="text-3xl font-bold  mb-6">Add Supplier</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-[#F7DACD] p-10"
      >
        {/* Updated Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            {/* Contact Person */}
            <div>
              <label className="block font-medium">Contact Person*</label>
              <input
                type="text"
                name="contactPerson"
                value={formData["contactPerson"]}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors["contactPerson"] && (
                <p className="text-red-500 text-sm">
                  {errors["contactPerson"]}
                </p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="block font-medium">Company Name*</label>
              <input
                type="text"
                name="companyname"
                value={formData["companyname"]}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors["companyname"] && (
                <p className="text-red-500 text-sm">{errors["companyname"]}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block font-medium">Company Description</label>
            <textarea
              name="description"
              value={formData["description"]}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg px-3 py-2 h-full"
            ></textarea>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Number */}
          <div>
            <label className="block font-medium">Contact Number*</label>
            <input
              type="text"
              name="phone"
              value={formData["phone"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["phone"] && (
              <p className="text-red-500 text-sm">{errors["phone"]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium">Email*</label>
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

          {/* Website */}
          <div>
            <label className="block font-medium">Website</label>
            <input
              type="text"
              name="website"
              value={formData["website"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block font-medium">GST Number</label>
              <input
                type="text"
                name="gst_number"
                value={formData["gst_number"]}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Upload Documents</label>

              <label className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 cursor-pointer bg-white hover:bg-gray-50 h-12">
                {formData.filePreview ? (
                  <div className="flex items-center gap-3 w-full">
                    {formData.fileType === "application/pdf" ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                        <p className="text-sm truncate">
                          {formData.license?.name}
                        </p>
                      </>
                    ) : (
                      <img
                        src={formData.filePreview}
                        alt="Preview"
                        className="h-8 w-8 object-cover rounded"
                      />
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">
                    Select File (PDF/JPG/PNG)
                  </span>
                )}

                <input
                  type="file"
                  name="license"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block font-medium">Business Address*</label>
            <textarea
              name="address"
              value={formData["address"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 h-full"
              rows="4"
            />
            {errors["address"] && (
              <p className="text-red-500 text-sm">{errors["address"]}</p>
            )}
          </div>
        </div>
      </form>

      {/* Centered Submit and Cancel buttons in 2 lines */}
      <div className="flex flex-col items-center gap-4 mt-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-green-400 text-white w-[600px] px-4 py-3 rounded-lg font-semibold  text-[40px] transition h-[74px] text-center"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-red-400 text-white px- py-3 rounded-lg font-semibold hover:bg-gray-500 transition w-[600px] text-[40px] h-[74px] text-center"
        >
          Cancel
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 relative flex flex-col items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
              alt="Success"
              className="w-40 h-40 mb-4"
            />
            <p className="text-xl font-semibold mb-4">
              Supplier Added Successfully!
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold  transition"
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

import React, { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";

const PurchaseEntry = () => {
  const [supplier, setSupplier] = useState("");
  const [purchaseType, setPurchaseType] = useState("cash");

  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNo: "",
    invoiceDate: "",
    poId: "",
    invoiceAmount: "",
  });

  const [products, setProducts] = useState([]);

  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    batch: "",
    expDate: "",
    packing: "",
    qty: "",
    free: "",
    total: "",
    ptr: "",
    ptrStrip: "",
    mrp: "",
    mrpStrip: "",
    saleRate: "",
    gst: "",
    discount: "",
    netAmount: "",
  });

  // --- taxForm: controlled tax section fields ---
  const [taxForm, setTaxForm] = useState({
    taxScheme: "GST 18%",
    hsnCode: "",
    ptrDiscount: "",
    prevPRate: "",
    prevFree: "",
    prevMRP: "",
    taxAmount: "",
    taxFree: "",
    grossAmount: "",
    amount: "",
  });

  // editing state for product table
  const [editingIndex, setEditingIndex] = useState(null);

  // -------------------- LIFECYCLE: load saved products --------------------
  useEffect(() => {
    const saved = localStorage.getItem("purchase_products");
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch {
        setProducts([]);
      }
    }
    const savedPage = localStorage.getItem("purchase_entry_saved");
    if (savedPage) {
      // optional: you can choose to prefill invoice + tax if desired.
      // we do NOT auto-load page-saved data to avoid surprising the user.
    }
  }, []);

  // persist products to localStorage so table survives browser refresh
  useEffect(() => {
    localStorage.setItem("purchase_products", JSON.stringify(products));
  }, [products]);

  // -------------------- HANDLE CHANGE --------------------
  const handleInvoiceChange = (e) => {
    setInvoiceForm({ ...invoiceForm, [e.target.name]: e.target.value });
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm({ ...productForm, [name]: value });
  };

  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    setTaxForm({ ...taxForm, [name]: value });
  };

  // -------------------- PRODUCT SECTION: add/update/reset --------------------
  const addOrUpdateProduct = () => {
    if (editingIndex !== null && editingIndex >= 0) {
      // update existing product
      const newProducts = [...products];
      newProducts[editingIndex] = { ...productForm };
      setProducts(newProducts);
      setEditingIndex(null);
    } else {
      // add new product
      setProducts([...products, { ...productForm }]);
    }
    resetProductForm();
  };

  const handleAddProductSection = () => {
    addOrUpdateProduct();
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      category: "",
      batch: "",
      expDate: "",
      packing: "",
      qty: "",
      free: "",
      total: "",
      ptr: "",
      ptrStrip: "",
      mrp: "",
      mrpStrip: "",
      saleRate: "",
      gst: "",
      discount: "",
      netAmount: "",
    });
    setEditingIndex(null);
  };

  const handleRefreshProductSection = () => {
    // Only clear product form (do NOT touch products table)
    resetProductForm();
  };

  // -------------------- PAGE-LEVEL: save all / refresh all --------------------
  const handleSaveWholePage = () => {
    const payload = {
      supplier,
      purchaseType,
      invoiceForm,
      taxForm,
      products,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("purchase_entry_saved", JSON.stringify(payload));
    alert("Page data saved (saved to localStorage).");
  };

  const handleRefreshWholePage = () => {
    // clear everything including the products table and saved localStorage
    setSupplier("");
    setPurchaseType("cash");
    setInvoiceForm({
      invoiceNo: "",
      invoiceDate: "",
      poId: "",
      invoiceAmount: "",
    });
    setTaxForm({
      taxScheme: "GST 18%",
      hsnCode: "",
      ptrDiscount: "",
      prevPRate: "",
      prevFree: "",
      prevMRP: "",
      taxAmount: "",
      taxFree: "",
      grossAmount: "",
      amount: "",
    });
    resetProductForm();
    setProducts([]);
    setEditingIndex(null);
    localStorage.removeItem("purchase_products");
    localStorage.removeItem("purchase_entry_saved");
  };


  const handleEditProduct = (index) => {
    const p = products[index];
    if (!p) return;

    setProductForm({ ...p });
    setEditingIndex(index);
 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = (index) => {
    if (!confirm("Delete this product?")) return;
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);

    if (editingIndex === index) {
      resetProductForm();
    } else if (editingIndex !== null && editingIndex > index) {
     
      setEditingIndex(editingIndex - 1);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Purchase Entry</h1>

      <div className="bg-[#F7DACD] shadow-md p-6 rounded-xl">
        {/* ---------------- INVOICE DETAILS ---------------- */}
        <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Supplier */}
          <div>
            <label className="font-medium">Supplier</label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="">Select Supplier</option>
              <option value="ABC">ABC Medical Suppliers</option>
              <option value="XYZ">XYZ Pharma</option>
              <option value="Vision">Vision Care Suppliers</option>
            </select>
          </div>

          {/* Invoice Number */}
          <div>
            <label className="font-medium">Invoice Number</label>
            <input
              name="invoiceNo"
              value={invoiceForm.invoiceNo}
              onChange={handleInvoiceChange}
              type="text"
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          {/* Invoice Date */}
          <div>
            <label className="font-medium">Invoice Date</label>
            <input
              name="invoiceDate"
              value={invoiceForm.invoiceDate}
              onChange={handleInvoiceChange}
              type="date"
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Purchase Type</label>
            <select
              name="purchaseTypeLocal"
              className="w-full p-2 border rounded mt-1"
            >
              <option value="regular">Regular</option>
              <option value="return">Return</option>
              <option value="exchange">Exchange</option>
            </select>
          </div>

          {/* Purchase Order ID */}
          <div className="relative">
            <label className="font-medium">Purchase Order ID</label>
            <input
              name="poId"
              value={invoiceForm.poId}
              onChange={handleInvoiceChange}
              type="text"
              className="w-full p-2 border rounded mt-1 pr-10"
            />
            <FaSearch className="absolute right-3 top-10 text-gray-500 cursor-pointer" />
          </div>

          {/* Invoice Amount */}
          <div>
            <label className="font-medium">Invoice Amount</label>
            <input
              name="invoiceAmount"
              value={invoiceForm.invoiceAmount}
              onChange={handleInvoiceChange}
              type="number"
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          {/* Payment Mode */}
          <div>
            <label className="font-medium">Payment Mode</label>
            <div className="flex flex-wrap gap-6 mt-2">
              {["cash", "credit", "upi", "debit"].map((type) => (
                <div
                  key={type}
                  className="flex items-center cursor-pointer"
                  onClick={() => setPurchaseType(type)}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      purchaseType === type
                        ? "border-yellow-500"
                        : "border-gray-400"
                    }`}
                  >
                    {purchaseType === type && (
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    )}
                  </div>
                  <span className="ml-2 capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- DYNAMIC PAYMENT FIELDS ---------------- */}
        {purchaseType === "credit" && (
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <label>Credit Date</label>
              <input className="w-full p-2 border rounded mt-1" type="date" />
            </div>
            <div>
              <label>Due Date</label>
              <input className="w-full p-2 border rounded mt-1" type="date" />
            </div>
          </div>
        )}

        {purchaseType === "upi" && (
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <label>Transaction ID</label>
              <input className="w-full p-2 border rounded mt-1" />
            </div>
            <div>
              <label>Transaction Date</label>
              <input className="w-full p-2 border rounded mt-1" type="date" />
            </div>
          </div>
        )}

        {purchaseType === "debit" && (
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <label>Bank Name</label>
              <input className="w-full p-2 border rounded mt-1" />
            </div>
            <div>
              <label>Transaction ID</label>
              <input className="w-full p-2 border rounded mt-1" />
            </div>
          </div>
        )}

        {/* ---------------- PRODUCT DETAILS ---------------- */}
        <h2 className="text-lg font-semibold mt-10 mb-4">Product Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          <div>
            <label>Product Name</label>
            <input
              name="name"
              value={productForm.name}
              onChange={handleProductChange}
              className="w-full p-2 border rounded mt-1"
              type="text"
            />
          </div>

          <div>
            <label>Category</label>
            <select
              name="category"
              value={productForm.category}
              onChange={handleProductChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="">Select Category</option>
              <option>Medicine</option>
              <option>Eye Drop</option>
              <option>Tablet</option>
            </select>
          </div>

          <div>
            <label>Batch</label>
            <input
              name="batch"
              value={productForm.batch}
              onChange={handleProductChange}
              className="w-full p-2 border rounded mt-1"
              type="text"
            />
          </div>

          <div>
            <label>Expiry</label>
            <input
              name="expDate"
              value={productForm.expDate}
              onChange={handleProductChange}
              className="w-full p-2 border rounded mt-1"
              type="date"
            />
          </div>

          <div>
            <label>Packing</label>
            <input
              name="packing"
              value={productForm.packing}
              onChange={handleProductChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label>Qty</label>
            <input
              name="qty"
              value={productForm.qty}
              onChange={handleProductChange}
              className="w-full p-2 border rounded mt-1"
              type="number"
            />
          </div>

          <div>
            <label>Free</label>
            <input
              name="free"
              value={productForm.free}
              onChange={handleProductChange}
              className="w-full p-2 border rounded mt-1"
              type="number"
            />
          </div>

          <div>
            <label>Total</label>
            <input
              name="total"
              value={productForm.total}
              onChange={handleProductChange}
              className="w-full p-2 border rounded mt-1"
              type="number"
            />
          </div>

          <div>
            <label>PTR</label>
            <input
              name="ptr"
              value={productForm.ptr}
              onChange={handleProductChange}
              className="w-full p-2 border rounded mt-1"
              type="number"
            />
            <select
              name="ptrStrip"
              value={productForm.ptrStrip}
              onChange={handleProductChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="">Strip</option>
              <option>Box</option>
              <option>Unit</option>
            </select>
          </div>

          <div>
            <label>MRP</label>
            <input
              name="mrp"
              value={productForm.mrp}
              onChange={handleProductChange}
              className="w-full p-2 border rounded mt-1"
              type="number"
            />
            <select
              name="mrpStrip"
              value={productForm.mrpStrip}
              onChange={handleProductChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="">Strip</option>
              <option>Box</option>
              <option>Unit</option>
            </select>
          </div>

          <div>
            <label>Sale Rate</label>
            <input
              name="saleRate"
              value={productForm.saleRate}
              onChange={handleProductChange}
              className="w-full p-2 border rounded mt-1"
              type="number"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAddProductSection}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editingIndex !== null ? "Update Product" : "Add Product"}
          </button>

          <button
            onClick={handleRefreshProductSection}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>
        </div>

        {/* ------------------ TABLE ------------------ */}
        {products.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="w-full border">
              <thead className="bg-gray-900 text-white">
                <tr>
                  {[
                    "Product",
                    "Category",
                    "Qty",
                    "Free",
                    "Total",
                    "MRP",
                    "PTR",
                    "Batch",
                    "Expiry",
                    "PTR Strip",
                    "MRP Strip",
                    "Sale Rate",
                    "GST",
                    "Discount",
                    "Net Amount",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="border p-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {products.map((p, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="border p-2">{p.name}</td>
                    <td className="border p-2">{p.category}</td>
                    <td className="border p-2">{p.qty}</td>
                    <td className="border p-2">{p.free}</td>
                    <td className="border p-2">{p.total}</td>
                    <td className="border p-2">{p.mrp}</td>
                    <td className="border p-2">{p.ptr}</td>
                    <td className="border p-2">{p.batch}</td>
                    <td className="border p-2">{p.expDate}</td>
                    <td className="border p-2">{p.ptrStrip}</td>
                    <td className="border p-2">{p.mrpStrip}</td>
                    <td className="border p-2">{p.saleRate}</td>
                    <td className="border p-2">{p.gst}</td>
                    <td className="border p-2">{p.discount}</td>
                    <td className="border p-2">{p.netAmount}</td>
                    <td className="border p-2 flex gap-2">
                      <button
                        title="Edit"
                        onClick={() => handleEditProduct(idx)}
                        className="p-2 rounded hover:bg-gray-200"
                      >
                        <FaEdit />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDeleteProduct(idx)}
                        className="p-2 rounded hover:bg-gray-200"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------------- TAX SECTION ---------------- */}
        <h2 className="text-lg font-semibold mt-10 mb-4">Tax Scheme (GST)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Tax Scheme</label>
            <select
              name="taxScheme"
              value={taxForm.taxScheme}
              onChange={handleTaxChange}
              className="w-full border p-2 rounded"
            >
              <option>GST 5%</option>
              <option>GST 12%</option>
              <option>GST 18%</option>
              <option>GST 28%</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">HSN Code</label>
            <input
              name="hsnCode"
              value={taxForm.hsnCode}
              onChange={handleTaxChange}
              type="text"
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">PTR Discount (%)</label>
            <input
              name="ptrDiscount"
              value={taxForm.ptrDiscount}
              onChange={handleTaxChange}
              type="number"
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium text-red-600 block mb-1">
              Prev P. Rate
            </label>
            <input
              name="prevPRate"
              value={taxForm.prevPRate}
              onChange={handleTaxChange}
              type="number"
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-red-600 block mb-1">
              Prev Free
            </label>
            <input
              name="prevFree"
              value={taxForm.prevFree}
              onChange={handleTaxChange}
              type="number"
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-red-600 block mb-1">
              Prev MRP
            </label>
            <input
              name="prevMRP"
              value={taxForm.prevMRP}
              onChange={handleTaxChange}
              type="number"
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div>
            <label className="text-sm font-medium block mb-1">Tax Amount</label>
            <input
              name="taxAmount"
              value={taxForm.taxAmount}
              onChange={handleTaxChange}
              type="number"
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Tax Free</label>
            <input
              name="taxFree"
              value={taxForm.taxFree}
              onChange={handleTaxChange}
              type="number"
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Gross Amount</label>
            <input
              name="grossAmount"
              value={taxForm.grossAmount}
              onChange={handleTaxChange}
              type="number"
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Amount</label>
            <input
              name="amount"
              value={taxForm.amount}
              onChange={handleTaxChange}
              type="number"
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => {
             
              if (
                productForm.name ||
                productForm.category ||
                productForm.batch ||
                productForm.qty
              ) {
                
                addOrUpdateProduct();
              }

              handleSaveWholePage();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
          >
            Add 
          </button>

          <button
            onClick={handleRefreshWholePage}
            className="bg-red-600 text-white px-4 py-2 rounded mb-4"
          >
            Refresh 
          </button>
        </div>

        {/* TAX TABLE */}
        <div className="mt-8">
          <h3 className="text-md font-semibold mb-2">Tax Breakdown</h3>
          <table className="w-full border text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Scheme Name</th>
                <th className="border p-2">Taxable Amount</th>
                <th className="border p-2">Tax Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">{taxForm.taxScheme || "GST 12%"}</td>
                <td className="border p-2">{taxForm.grossAmount || "0.00"}</td>
                <td className="border p-2">{taxForm.taxAmount || "0.00"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseEntry;

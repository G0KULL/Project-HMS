import React, { useState, useEffect } from "react";
import Subima from "../assets/subima.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Eye from "./Eye";
import Pog from "./Pog";
import FollowUp from "./FollowUp";
import Details from "./Details";
import { FiRefreshCw } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

const PatientInfo = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [doctorName, setDoctorName] = useState("-");
  const [latestOptometry, setLatestOptometry] = useState(null);
  const [consultationId, setConsultationId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const location = useLocation();
  const navigate = useNavigate();
  const navState = location.state || {};

  const [pogData, setPogData] = useState({});
  const [optometryData, setOptometryData] = useState(null);



  

  const [detailsData, setDetailsData] = useState({});
  const [followUpData, setFollowUpData] = useState({});

  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");


  const tabs = [
    { label: "Readings", path: "/Reading" },
    { label: "Examination", path: "/examinationDoc" },
    { label: "Case History", path: "/CaseHistory" },
    { label: "Draw", path: "/Draw" },
  ];
  // Check if consultation already exists for this appointment
  const checkExistingConsultation = async (appointmentId) => {
    try {
      const res = await fetch(`${API_BASE}/consultations/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) return null;
      
      const consultations = await res.json();
      const existing = Array.isArray(consultations)
        ? consultations.find((c) => c.appointment_id === appointmentId)
        : null;
      
      return existing;
    } catch (err) {
      console.error("Error checking consultation:", err);
      return null;
    }
  };


  const [extraNote, setExtraNote] = useState(latestOptometry?.extraNote || "");
const [extraOptions, setExtraOptions] = useState({
  Glass: false,
  Polycarbonate: false,
  "CR 39": false,
  Unifocal: false,
  "D'Bifocal": false,
  Kryptok: false,
  Progressive: false,
  "Office Lens": false,
  Tint: false,
  Photochromic: false,
  ARC: false,
  Polarised: false,
});


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log("Already submitting, please wait...");
      return;
    }

    setIsSubmitting(true);
  
    try {
      // Get required IDs
      const companyId = [
        patientData?.company_id,
        patientData?.companyId,
        latestOptometry?.company_id,
        localStorage.getItem("company_id"),
      ]
        .map((v) => (v !== undefined && v !== null ? parseInt(v) : NaN))
        .find((n) => !Number.isNaN(n)) ?? null;
      
      const userId = parseInt(localStorage.getItem("user_id") || "0");
      const doctorId = [
        patientData?.doctor_id,
        patientData?.doctorId,
        patientData?.doctor?.id,
        latestOptometry?.doctor_id,
        localStorage.getItem("doctor_id"),
      ]
        .map((v) => (v !== undefined && v !== null && v !== "" ? parseInt(v) : NaN))
        .find((n) => !Number.isNaN(n)) ?? null;
      const optometryId = latestOptometry?.id ? parseInt(latestOptometry.id) : null;
      
      // Validate required fields
      // if (!companyId) {
      //   alert("Missing company_id. Please ensure the appointment has a company_id.");
      //   setIsSubmitting(false);
      //   return;
      // }
      
      if (!userId) {
        alert("Missing user_id. Please log in again.");
        setIsSubmitting(false);
        return;
      }
      
      // if (!doctorId || Number.isNaN(doctorId)) {
      //   alert("Doctor ID is required. Please ensure the appointment has a valid doctor selected.");
      //   setIsSubmitting(false);
      //   return;
      // }
      
      if (!optometryId) {
        alert("Optometry record is required. Please complete the optometry reading first.");
        setIsSubmitting(false);
        return;
      }
      
      // if (!followUpData.date) {
      //   alert("Follow-up date is required.");
      //   setIsSubmitting(false);
      //   return;
      // }
      
      // Provide required date fields if backend expects them
      const todayStr = new Date().toISOString().split("T")[0];
      const startDate = followUpData?.startDate || patientData?.visitDate || todayStr;
      const endDate = followUpData?.endDate || followUpData?.date || patientData?.visitDate || todayStr;
      
      // Format lists
      const diagnosisList = (detailsData.diagnosisList || []).map(item => ({
        condition: item.condition || "",
        eye: item.eye || "Both",
      }));
      
      const procedureList = (detailsData.procedureList || []).map(item => ({
        name: item.name || "",
        eye: item.eye || "Both",
        remarks: item.remarks || null,
      }));
      
      const otCounsellingList = (detailsData.otCounsellingList || []).map(item => ({
        procedure_name: item.procedure_name || "",
        eye: item.eye || "Both",
        remarks: item.remarks || null,
        consent: item.consent || null,
      }));
      
      // Build consultation data
      // ✅ Build consultation data — doctor_id & company_id are now handled by backend
const consultationData = {
  patient_id: parseInt(patientData?.patient_id || patientData?.id),
  appointment_id: parseInt(patientData?.id),
  optometry_id: latestOptometry?.id ? parseInt(latestOptometry.id) : null,
  user_id: parseInt(localStorage.getItem("user_id") || "0"),

  followup_date: followUpData.date,
  start_date: followUpData?.startDate || patientData?.visitDate || new Date().toISOString().split("T")[0],
  end_date: followUpData?.endDate || followUpData?.date || patientData?.visitDate || new Date().toISOString().split("T")[0],

  // Follow-up fields
  nextVisit: followUpData.nextVisit || null,
  usagePerDay: followUpData.usagePerDay || null,
  transferOutside: followUpData.transferOutside || false,
  outsideDetails: followUpData.outsideDetails || null,
  dilatation: followUpData.dilatation || false,
  rerefraction: followUpData.rerefraction || false,
  highRiskPatient: followUpData.highRiskPatient || false,
  fileClose: followUpData.fileClose || false,
  additionalRemarks: followUpData.additionalRemarks || null,
  highRiskRemarks: followUpData.highRiskRemarks || null,

  extra_note: extraNote,
  extra_options: Object.keys(extraOptions).filter((key) => extraOptions[key]),
  pog: pogData,

  // Diagnosis
  diagnosis: (detailsData.diagnosisList || []).map(item => ({
    condition: item.condition || "",
    eye: item.eye || "Both",
  })),
  dia_comments_le: detailsData.diagnosisComments?.LE || null,
  dia_comments_re: detailsData.diagnosisComments?.RE || null,

  // Procedure
  procedure: (detailsData.procedureList || []).map(item => ({
    name: item.name || "",
    eye: item.eye || "Both",
    remarks: item.remarks || null,
  })),
  pro_comments_le: detailsData.procedureComments?.LE || null,
  pro_comments_re: detailsData.procedureComments?.RE || null,

  // OT Counselling
  ot_counsil: (detailsData.otCounsellingList || []).map(item => ({
    procedure_name: item.procedure_name || "",
    eye: item.eye || "Both",
    remarks: item.remarks || null,
    consent: item.consent || null,
  })),

  // Medicines (already included correctly)
  ...detailsData.medicineData,
};

  
      console.log("📤 Submitting consultation data:", consultationData);
      
      let res;
      let url;
      let method;
      
      // If consultation exists, UPDATE it
      if (consultationId) {
        console.log("🔄 Updating existing consultation:", consultationId);
        url = `${API_BASE}/consultations/${consultationId}`;
        method = "PUT";
      } else {
        // Otherwise, CREATE new consultation
        console.log("✨ Creating new consultation");
        url = `${API_BASE}/consultations/`;
        method = "POST";
      }
      
      res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(consultationData),
      });
  
      console.log("📡 Response status:", res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ API Error:", errorData);
        throw new Error(errorData.detail || "Failed to save consultation");
      }
  
      const savedConsultation = await res.json();
      console.log("✅ Consultation saved successfully:", savedConsultation);
      
      setConsultationId(savedConsultation.id);
      
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        // Optionally navigate away or refresh
        // navigate("/some-success-page");
      }, 3000);
      
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert(err.message || "Failed to save consultation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields?")) {
      setDetailsData({});
      setFollowUpData({});
      
      // Reset form if it exists
      const form = document.querySelector("form");
      if (form) form.reset();
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        const appointment = navState.appointment;
        if (!appointment?.id) throw new Error("No appointment data found");

        // Check if consultation already exists
        const existingConsultation = await checkExistingConsultation(appointment.id);
        if (existingConsultation) {
          console.log("📋 Found existing consultation:", existingConsultation.id);
          setConsultationId(existingConsultation.id);
          
          // TODO: Pre-fill form with existing data if needed
          // setDetailsData({ ... });
          // setFollowUpData({ ... });
        }

        // Fetch optometry records
        const res = await fetch(`${API_BASE}/optometrys/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch optometry records");
        const allRecords = await res.json();

        const appointmentRecords = Array.isArray(allRecords)
          ? allRecords.filter((r) => r.appointment_id === appointment.id)
          : [];

        if (appointmentRecords.length > 0) {
          appointmentRecords.sort((a, b) => (b.id || 0) - (a.id || 0));
          setLatestOptometry(appointmentRecords[0]);
        }

        setPatientData(appointment);

        // Fetch doctor name
        const resolvedDoctorId = appointment.doctor_id || appointment.doctorId;
        if (resolvedDoctorId) {
          const doctorRes = await fetch(`${API_BASE}/doctors/${resolvedDoctorId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (doctorRes.ok) {
            const doctorData = await doctorRes.json();
            setDoctorName(doctorData.full_name || doctorData.name || "-");
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [location.state, token, API_BASE]);

  if (loading)
    return (
      <div className="text-blue-600 font-semibold flex items-center justify-center gap-2 h-screen">
        Loading patient data... <FiRefreshCw className="animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 font-semibold flex items-center justify-center h-screen">
        Error: {error}
      </div>
    );


  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-8xl mx-auto p-6 space-y-6">
        {/* Patient Info Header */}
        {patientData && (
          <div className="bg-[#F7DACD] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 font-medium text-2xl w-full md:w-2/3">
              <p>
                <span className="font-bold">Name:</span>{" "}
                {patientData.fullName || patientData.full_name || patientData.name || "-"}
              </p>
              <p>
                <span className="font-bold">Age:</span> {patientData.age || "-"} YEARS
              </p>
              <p>
                <span className="font-bold">Gender:</span> {patientData.gender || "-"}
              </p>
              <p>
                <span className="font-bold">MR Number:</span>{" "}
                {patientData.custom_id || patientData.id || "-"}
              </p>
              <p>
                <span className="font-bold">Visit Type:</span>{" "}
                {patientData.patient_type || "GENERAL CONSULTATION"}
              </p>
              <p>
                <span className="font-bold">Doctor:</span> {doctorName}
              </p>
              {consultationId && (
                <p className="text-green-600">
                  <span className="font-bold">Consultation ID:</span> {consultationId}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
      <div className="flex justify-start space-x-4">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <p
              key={tab.label}
              onClick={() => navigate(tab.path, { state: navState })}
              className={`border px-8 py-2 rounded-full font-bold text-2xl cursor-pointer transition
                ${isActive ? "bg-[#F7DACD] " : "hover:bg-[#F7DACD] "}`}
            >
              {tab.label}
            </p>
          );
        })}
      </div>
       

        {/* Eye Section */}
        <Eye data={latestOptometry} />

        <Pog data={latestOptometry} onChange={setPogData} />

  <div className="mb-4">
  <label className="block font-semibold mb-1">Extra Note</label>
  <textarea
    className="border p-2 rounded w-full mb-2"
    value={extraNote}
    onChange={(e) => setExtraNote(e.target.value)}
    placeholder="Enter additional notes here..."
  />

  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
    {Object.keys(extraOptions).map((option) => (
      <label key={option} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={extraOptions[option]}
          onChange={(e) =>
            setExtraOptions((prev) => ({ ...prev, [option]: e.target.checked }))
          }
          className="w-5 h-5"
        />
        {option}
      </label>
    ))}
  </div>
</div>



        {/* Details Section */}
        <Details onChange={(data) => setDetailsData(data)} />
        
        {/* Follow Up Section */}
        <FollowUp onChange={(data) => setFollowUpData(data)} />

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            RESET <FiRefreshCw className="w-5 h-5" />
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <FiRefreshCw className="w-5 h-5 animate-spin" />
                {consultationId ? "UPDATING..." : "SUBMITTING..."}
              </>
            ) : (
              <>
                {consultationId ? "UPDATE" : "SUBMIT"} <FaCheckCircle className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Popup message */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[90%] max-w-[900px]">
              <img
                src={Subima}
                alt="Success"
                className="w-full max-w-[626px] h-auto mx-auto mb-4"
              />
              <p className="text-xl font-semibold text-green-600 mt-4">
                {consultationId ? "✅ Consultation Updated Successfully!" : "✅ Consultation Created Successfully!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default PatientInfo;
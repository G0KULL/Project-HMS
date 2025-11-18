/* FULL FIXED CODE — NO INFINITE UPDATE LOOP */

import React, { useState, useEffect, useCallback } from "react";
import Subima from "../assets/subima.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Eye from "../components/Eye";
import Pog from "../components/Pog";
import FollowUp from "../components/FollowUp";
import Details from "../components/Details";
import { FiRefreshCw } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

const ExaminationDoc = () => {
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
  const [detailsData, setDetailsData] = useState({});
  const [followUpData, setFollowUpData] = useState({});

  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  const [medicineData, setMedicineData] = useState([]);


  // 🔥 FIXED — should NOT be inside handleSubmit
  const handleDetailsChange = useCallback((data) => {
    setDetailsData(data);
  }, []);

  // EXTRA fields
  const [extraNote, setExtraNote] = useState("");
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

  const tabs = [
    { label: "Readings", path: "/Reading" },
    { label: "Examination", path: "/examinationDoc" },
    { label: "Case History", path: "/CaseHistory" },
    { label: "Draw", path: "/Draw" },
  ];

  // Check consultation
  const checkExistingConsultation = async (appointmentId) => {
    try {
      const res = await fetch(`${API_BASE}/consultations/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return null;

      const consultations = await res.json();
      return consultations.find((c) => c.appointment_id === appointmentId) || null;
    } catch (err) {
      return null;
    }
  };

  // ---------------------------
  // SUBMIT HANDLER
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const userId = parseInt(localStorage.getItem("user_id") || "0");
      if (!userId) throw new Error("Missing user ID");

      const optometryId = latestOptometry?.id;
      if (!optometryId) throw new Error("Optometry record is missing");

      // Consultation payload
      const consultationData = {
        patient_id: parseInt(patientData?.patient_id || patientData?.id),
        appointment_id: parseInt(patientData?.id),
        optometry_id: optometryId,
        user_id: userId,

        followup_date: followUpData.date,
        start_date:
          followUpData.startDate ||
          patientData.visitDate ||
          new Date().toISOString().split("T")[0],
        end_date:
          followUpData.endDate ||
          followUpData.date ||
          patientData.visitDate ||
          new Date().toISOString().split("T")[0],

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
        extra_options: Object.keys(extraOptions).filter((k) => extraOptions[k]),

        pog: pogData,

        diagnosis: (detailsData.diagnosisList || []).map((d) => ({
          condition: d.condition || "",
          eye: d.eye || "Both",
        })),
        dia_comments_le: detailsData.diagnosisComments?.LE || null,
        dia_comments_re: detailsData.diagnosisComments?.RE || null,

        procedure: (detailsData.procedureList || []).map((p) => ({
          name: p.name || "",
          eye: p.eye || "Both",
          remarks: p.remarks || null,
        })),
        pro_comments_le: detailsData.procedureComments?.LE || null,
        pro_comments_re: detailsData.procedureComments?.RE || null,

        ot_counsil: (detailsData.otCounsellingList || []).map((o) => ({
          procedure_name: o.procedure_name || "",
          eye: o.eye || "Both",
          remarks: o.remarks || null,
          consent: o.consent || null,
        })),

        medicines: detailsData.medicines || [],

      };

      let res;
      if (consultationId) {
        res = await fetch(`${API_BASE}/consultations/${consultationId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(consultationData),
        });
      } else {
        res = await fetch(`${API_BASE}/consultations/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(consultationData),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to save consultation");
      }

      const result = await res.json();
      setConsultationId(result.id);

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------
  // FETCH PATIENT DATA
  // ---------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const appointment = navState.appointment;
        if (!appointment) throw new Error("No appointment data found");

        // check consultation
        const existing = await checkExistingConsultation(appointment.id);
        if (existing) setConsultationId(existing.id);

        // fetch optometry
        const res = await fetch(`${API_BASE}/optometrys/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const all = await res.json();
        const records = all.filter((r) => r.appointment_id === appointment.id);
        if (records.length) {
          records.sort((a, b) => b.id - a.id);
          setLatestOptometry(records[0]);
        }

        setPatientData(appointment);

        if (appointment.doctor_id) {
          const d = await fetch(`${API_BASE}/doctors/${appointment.doctor_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (d.ok) {
            const doctor = await d.json();
            setDoctorName(doctor.full_name || doctor.name || "-");
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

  // ---------------------------
  // UI RENDER
  // ---------------------------

  if (loading)
    return (
      <div className="text-blue-600 flex items-center justify-center h-screen">
        Loading… <FiRefreshCw className="animate-spin ml-2" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 flex items-center justify-center h-screen">
        Error: {error}
      </div>
    );

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-8xl mx-auto p-6 space-y-6">

        {/* Patient Header */}
        {patientData && (
          <div className="bg-[#F7DACD] p-6 rounded-xl text-xl">
            <p><b>Name:</b> {patientData.fullName || "-"}</p>
            <p><b>Age:</b> {patientData.age || "-"}</p>
            <p><b>MR Number:</b> {patientData.custom_id || patientData.id}</p>
            <p><b>Doctor:</b> {doctorName}</p>
            {consultationId && (
              <p className="text-green-600 font-bold">
                Consultation ID: {consultationId}
              </p>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <p
              key={tab.label}
              className={`px-6 py-2 rounded-full border cursor-pointer ${
                location.pathname === tab.path
                  ? "bg-[#F7DACD]"
                  : "hover:bg-[#F7DACD]"
              }`}
              onClick={() => navigate(tab.path, { state: navState })}
            >
              {tab.label}
            </p>
          ))}
        </div>

        {/* Eye Section */}
        <Eye data={latestOptometry} />

        {/* POG */}
        <Pog data={latestOptometry} onChange={setPogData} />

        {/* Extra Note + Options */}
        <div>
          <label className="font-semibold">Extra Note</label>
          <textarea
            className="border p-2 w-full rounded"
            value={extraNote}
            onChange={(e) => setExtraNote(e.target.value)}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {Object.keys(extraOptions).map((opt) => (
              <label key={opt} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={extraOptions[opt]}
                  onChange={(e) =>
                    setExtraOptions((prev) => ({
                      ...prev,
                      [opt]: e.target.checked,
                    }))
                  }
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Details */}
        <Details onChange={handleDetailsChange} />

        {/* Follow Up */}
        <FollowUp onChange={(data) => setFollowUpData(data)} />

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FiRefreshCw className="animate-spin" />{" "}
                {consultationId ? "UPDATING..." : "SUBMITTING..."}
              </>
            ) : (
              <>
                {consultationId ? "UPDATE" : "SUBMIT"}{" "}
                <FaCheckCircle />
              </>
            )}
          </button>
        </div>

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-white p-6 rounded-xl text-center">
              <img src={Subima} alt="Success" className="mx-auto mb-4" />
              <p className="text-green-600 text-xl font-semibold">
                {consultationId
                  ? "Consultation Updated Successfully!"
                  : "Consultation Created Successfully!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default ExaminationDoc;

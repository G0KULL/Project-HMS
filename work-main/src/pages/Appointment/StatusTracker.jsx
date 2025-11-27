import React, { useEffect, useState, useRef } from "react";

const DEFAULT_FLOW = [
  { code: "LOUNGE", label: "On Lounge" },
  { code: "OPTOMETRY", label: "At Optometry" },
  { code: "CONSULTATION", label: "At Consultation" },
  { code: "PHARMACY", label: "At Pharmacy" },
  { code: "COMPLETED", label: "Completed" },
];

export default function StatusTracker({ appointmentId, apiBase, pollInterval = 5000 }) {
  const API_BASE = apiBase || import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");
  const [statusData, setStatusData] = useState({ status: "LOUNGE", status_label: "On Lounge", timeline: [] });
  const mounted = useRef(true);

  const fetchStatus = async () => {
    if (!appointmentId) return;
    try {
      const res = await fetch(`${API_BASE}/appointments/${appointmentId}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (mounted.current) setStatusData(data);
    } catch (err) {
      console.error("StatusTracker fetch error:", err);
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchStatus();
    const id = setInterval(fetchStatus, pollInterval);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [appointmentId, API_BASE, pollInterval]);

  const timeline = Array.isArray(statusData.timeline) ? statusData.timeline : [];
  const currentCode = (statusData.status || "LOUNGE").toUpperCase();

  // Helper → get timeline info for a step
  const getStepInfo = (stepCode) => {
    return timeline.find(
      (t) => (t.status_code || t.status || "").toUpperCase() === stepCode
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        {DEFAULT_FLOW.map((step, idx) => {
          const completed = (() => {
            const flowIndex = DEFAULT_FLOW.findIndex((s) => s.code === step.code);
            const curIndex = DEFAULT_FLOW.findIndex((s) => s.code === currentCode);
            return (
              flowIndex < curIndex ||
              (flowIndex === curIndex &&
                timeline.some(
                  (t) => (t.status_code || t.status || "").toUpperCase() === step.code
                ))
            );
          })();

          const active = step.code === currentCode;
          const info = getStepInfo(step.code);

          return (
            <div key={step.code} className="flex-1 text-center">
              {/* Label */}
              <div
                className={`mt-2 text-sm ${
                  active
                    ? "text-green-700 font-semibold"
                    : completed
                    ? "text-gray-700"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </div>

              {/* Circle */}
              <div
                className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  active
                    ? "bg-green-500 text-white"
                    : completed
                    ? "bg-green-300 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {idx + 1}
              </div>

              {/* Time info below circle */}
              <div className="mt-1 text-xs text-gray-600">
                {info?.timestamp && (
                  <div>{new Date(info.timestamp).toLocaleTimeString()}</div>
                )}
                {info?.time_taken_minutes && (
                  <div>{info.time_taken_minutes} min</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

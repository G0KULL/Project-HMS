import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Optometry from "./components/pages/optometry";
import DoctorList from "./components/DoctorList";
import DoctorWaitingList from "./components/DocWaitingList";
import Reading from "./components/Reading";
import ExaminationDoc from "./components/ExaminationDoc";
import Diagnosis from "./components/Diagnosis";
import Procedure from "./components/Procedure";
import OtCounselling from "./components/OtCounselling";
import PrescribeMedi from "./components/PrescribeMedi";
import CaseHistory from "./components/CaseHistory";
import Draw from "./components/Draw";
import ConsultList from "./pages/OptoConsultation/ConsultList";
import RegistrationForm from "./pages/Appointment/RegistrationForm";
import Appointment from "./pages/Appointment/appointment";
import PatientsPage from "./pages/Patients/patients";
import AddPatient from "./pages/Patients/AddPatient";
import DoctorsPage from "./pages/Doctor/doctor";
import AddDoctor from "./pages/Doctor/AddDoctor";
import PharmacyPage from "./components/pages/pharmacy";
import ViewPrescription from "./components/Pages/Sections/ViewPrescription";
import ViewUnpaid from "./components/Pages/Sections/viewunpaid";
import AddMedicines from "./components/Pages/Sections/AddMedicines";
import ViewMedicines from "./components/Pages/Sections/ViewMedicines";
import BillsPage from "./components/Pages/bills";
import OpticalsPage from "./components/Pages/opticals";
import CounsellorDeskPage from "./components/Pages/counsellor-desk";
// import Supplier from "./components/Pages/Supplier";
import Inventory from "./components/Pages/inventory";

// import AddPatient from "./components/Pages/Sections/AddPatient";
import CardsData from "./components/Pages/Consultation";
import WaitingApprovel from "./pages/Insurance/WaitingApprovel";
import InsuranceProvider from "./pages/Insurance/InsuranceProvider"
import ForMailing from "./pages/Insurance/ForMailing";
// import SupplierTable from "./components/Supplier/supplierTable";
import SupplierTable from "./pages/Supplier/SupplierTable";
import AddSupplier from "./pages/Supplier/AddSupplier";
import InventoryMang from "./pages/Inventory/InventoryManag";
import InventoryItems from "./pages/Inventory/InventoryItems";
import OfferPage from "./pages/Offers/OfferPage";
import AddOffer from "./pages/Offers/AddOffer";
import SigninPage from "./pages/Signin";
import Dialated from "./components/Dialated";
import Keratometry from "./components/Keratometry";
import Pachymetry from "./components/Pachymetry";
import Eye from "./components/Eye";
import ConsultationBill from "./components/ConsultationBill";
// import CompanyPage from "./components/pages/Company/CompanyPage";

import Company from "./pages/Company/CompanyPage";
import AddCompany from "./pages/Company/AddCompany";
import User from "./pages/User/UserPage";
import AddUser from "./pages/User/AddUser";

import Dashboard from "./components/Dashboard";
import ProfileContainer from "./pages/ProfilePage/ProfileContainer";
import ChangePassword from "./pages/ChangePd";

import KitPage from "./pages/Kit/KitPage"
import AddKit from "./pages/Kit/AddKit"

import AddMedicinePage from "./pages/Medicine/AddMedicinePage";
import MedicinePage from "./pages/Medicine/MedicinePage";

import AddOpticals from "./pages/Opticals/AddOpticals";
import OpticalPage from "./pages/opticals/OpticalPage";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};



function App() {
  return (
    <div>
      {/* Navbar always visible */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<SigninPage/>}/>

        {/* Protected routes: wrap with ProtectedRoute so direct URL access requires auth */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/optometry/:id" element={<ProtectedRoute><Optometry /></ProtectedRoute>} />
        <Route path="/doctorsList" element={<ProtectedRoute><DoctorList /></ProtectedRoute>} />
        <Route path="/DoctorWaitingList" element={<ProtectedRoute><DoctorWaitingList /></ProtectedRoute>} />
        <Route path="/reading" element={<ProtectedRoute><Reading /></ProtectedRoute>} />
        <Route path="/examinationDoc" element={<ProtectedRoute><ExaminationDoc /></ProtectedRoute>} />
        <Route path="/diagnosis" element={<ProtectedRoute><Diagnosis /></ProtectedRoute>} />
        <Route path="/procedure" element={<ProtectedRoute><Procedure /></ProtectedRoute>} />
        <Route path="/otCounselling" element={<ProtectedRoute><OtCounselling /></ProtectedRoute>} />
        <Route path="/prescribeMedi" element={<ProtectedRoute><PrescribeMedi /></ProtectedRoute>} />
        <Route path="/CaseHistory" element={<ProtectedRoute><CaseHistory /></ProtectedRoute>} />
        <Route path="/Draw" element={<ProtectedRoute><Draw /></ProtectedRoute>} />
        <Route path="/ConsultList" element={<ProtectedRoute><ConsultList /></ProtectedRoute>} />
        <Route path="/appointment" element={<ProtectedRoute><Appointment /></ProtectedRoute>} />
        <Route path="/RegistrationForm" element={<ProtectedRoute><RegistrationForm /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
        <Route path="/add-patient" element={<ProtectedRoute><AddPatient /></ProtectedRoute>} />
        <Route path="/doctors" element={<ProtectedRoute><DoctorsPage /></ProtectedRoute>} />
        <Route path="/pharmacy" element={<ProtectedRoute><PharmacyPage /></ProtectedRoute>} />
        <Route path="/pharmacy/view-prescription" element={<ProtectedRoute><ViewPrescription /></ProtectedRoute>} />
        <Route path="/pharmacy/view-unpaid" element={<ProtectedRoute><ViewUnpaid /></ProtectedRoute>} />
        <Route path="/pharmacy/add-medicines" element={<ProtectedRoute><AddMedicines /></ProtectedRoute>} />
        <Route path="/pharmacy/view-medicines" element={<ProtectedRoute><ViewMedicines /></ProtectedRoute>} />
        <Route path="/doctors/add" element={<ProtectedRoute><AddDoctor /></ProtectedRoute>} />
        <Route path="/doctors/:mode/:id?" element={<ProtectedRoute><AddDoctor /></ProtectedRoute>} />
        <Route path="/bills" element={<ProtectedRoute><BillsPage /></ProtectedRoute>} />
        <Route path="/opticals" element={<ProtectedRoute><OpticalsPage /></ProtectedRoute>} />
        <Route path="/counsellor-desk" element={<ProtectedRoute><CounsellorDeskPage /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/Consultation" element={<ProtectedRoute><CardsData /></ProtectedRoute>} />
        <Route path="/WaitingApprovel" element={<ProtectedRoute><WaitingApprovel/></ProtectedRoute>}/>
        <Route path="/InsuranceProvider" element={<ProtectedRoute><InsuranceProvider/></ProtectedRoute>}/>
        <Route path="/ForMailing" element={<ProtectedRoute><ForMailing/></ProtectedRoute>}/>
        <Route path="/SupplierTable" element={<ProtectedRoute><SupplierTable/></ProtectedRoute>}/>
        <Route path="/AddSupplier" element={<ProtectedRoute><AddSupplier/></ProtectedRoute>}/>
        <Route path="/InventoryMang" element={<ProtectedRoute><InventoryMang/></ProtectedRoute>}/>
        <Route path="/InventoryItems" element={<ProtectedRoute><InventoryItems/></ProtectedRoute>}/>
        <Route path="/OfferPage" element={<ProtectedRoute><OfferPage/></ProtectedRoute>}/>
        <Route path="/AddOffer" element={<ProtectedRoute><AddOffer/></ProtectedRoute>}/>
        <Route path="/Dialated" element={<ProtectedRoute><Dialated/></ProtectedRoute>}/>
        <Route path="/Keratometry" element={<ProtectedRoute><Keratometry/></ProtectedRoute>}/>
        <Route path="/Pachymetry" element={<ProtectedRoute><Pachymetry/></ProtectedRoute>}/>
        <Route path="/Eye" element={<ProtectedRoute><Eye/></ProtectedRoute>}/>
        <Route path="/CompanyPage" element={<ProtectedRoute><Company/></ProtectedRoute>}/>
        <Route path="/AddCompany" element={<ProtectedRoute><AddCompany/></ProtectedRoute>}/>
        <Route path="/UserPage" element={<ProtectedRoute><User/></ProtectedRoute>}/>
        <Route path="/AddUser" element={<ProtectedRoute><AddUser/></ProtectedRoute>}/>
        <Route path="/ConsultationBill" element={<ProtectedRoute><ConsultationBill/></ProtectedRoute>}/>
        <Route path="/Addkit" element={<ProtectedRoute><AddKit/></ProtectedRoute>}/>
        <Route path="/KitPage" element={<ProtectedRoute><KitPage/></ProtectedRoute>}/>

        <Route path="/profile" element={<ProtectedRoute><ProfileContainer/></ProtectedRoute>}/>

       <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
       <Route path="/ChangePassword" element={<ProtectedRoute><ChangePassword/></ProtectedRoute>} />

       <Route path="/AddMedicinePage" element={<ProtectedRoute><AddMedicinePage/></ProtectedRoute>} />
        <Route path="/MedicinePage" element={<ProtectedRoute><MedicinePage/></ProtectedRoute>} />

        <Route path="/AddOpticals" element={<ProtectedRoute><AddOpticals/></ProtectedRoute>} />
        <Route path="/OpticalPage" element={<ProtectedRoute><OpticalPage/></ProtectedRoute>} />

      </Routes>
    </div>
  );
}

export default App;


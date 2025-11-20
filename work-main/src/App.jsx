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
import ConsultList from "./components/Pages/OptoConsultation/ConsultList";
import RegistrationForm from "./components/pages/sections/RegistrationForm";  
import Appointment from "./components/pages/appointment"
import PatientsPage from "./components/pages/patients";
import AddPatient from "./components/Pages/Sections/AddPatient";
import DoctorsPage from "./components/pages/doctor";
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
import AddDoctor from "./components/Pages/Sections/AddDoctor";
// import AddPatient from "./components/Pages/Sections/AddPatient";
import CardsData from "./components/Pages/Consultation";
import WaitingApprovel from "./components/Insurance/WaitingApprovel";
import InsuranceProvider from "./components/Insurance/InsuranceProvider"
import ForMailing from "./components/Insurance/ForMailing";
// import SupplierTable from "./components/Supplier/supplierTable";
import SupplierTable from "./components/Supplier/SupplierTable";
import AddSupplier from "./components/Supplier/AddSupplier";
import InventoryMang from "./components/Inventory/InventoryManag";
import InventoryItems from "./components/Inventory/InventoryItems";
import OfferPage from "./components/Offers/OfferPage";
import AddOffer from "./components/Offers/AddOffer";
import SigninPage from "./pages/Signin";
import Dialated from "./components/Dialated";
import Keratometry from "./components/Keratometry";
import Pachymetry from "./components/Pachymetry";
import Eye from "./components/Eye";
import ConsultationBill from "./components/ConsultationBill";
// import CompanyPage from "./components/pages/Company/CompanyPage";

import Company from "./components/pages/Company/CompanyPage";
import AddCompany from "./components/pages/Company/AddCompany";
import User from "./components/pages/User/UserPage";
import AddUser from "./components/pages/User/AddUser";

import Dashboard from "./components/Dashboard";
import ProfileContainer from "./components/ProfilePage/ProfileContainer";
import ChangePassword from "./pages/ChangePd";

import KitPage from "./components/pages/Kit/KitPage"
import AddKit from "./components/pages/Kit/AddKit"

import AddMedicinePage from "./pages/Medicine/AddMedicinePage";
import MedicinePage from "./pages/Medicine/MedicinePage";

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
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<SigninPage/>}/>
        <Route path="/optometry/:id" element={<Optometry />} />
        <Route path="/doctorsList" element={<DoctorList />} />
        <Route path="/DoctorWaitingList" element={<DoctorWaitingList />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/examinationDoc" element={<ExaminationDoc />} />
        <Route path="/diagnosis" element={<Diagnosis />} />
        <Route path="/procedure" element={<Procedure />} />
        <Route path="/otCounselling" element={<OtCounselling />} />
        <Route path="/prescribeMedi" element={<PrescribeMedi />} />
        <Route path="/CaseHistory" element={<CaseHistory />} />
        <Route path="/Draw" element={<Draw />} />
        <Route path="/ConsultList" element={<ConsultList />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/RegistrationForm" element={<RegistrationForm />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/add-patient" element={<AddPatient />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/pharmacy" element={<PharmacyPage />} />
        <Route path="/pharmacy/view-prescription" element={<ViewPrescription />} />
        <Route path="/pharmacy/view-unpaid" element={<ViewUnpaid />} />
        <Route path="/pharmacy/add-medicines" element={<AddMedicines />} />
        <Route path="/pharmacy/view-medicines" element={<ViewMedicines />} />
        <Route path="/doctors/add" element={<AddDoctor />} />
        <Route path="/doctors/:mode/:id?" element={<AddDoctor />} />
        <Route path="/bills" element={<BillsPage />} />
        <Route path="/opticals" element={<OpticalsPage />} />
        {/* <Route path="/insurance" element={<InsurancePage />} /> */}
        <Route path="/counsellor-desk" element={<CounsellorDeskPage />} />
        {/* <Route path="/supplier" element={<Supplier />} /> */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/Consultation" element={<CardsData />} />
        <Route path="/WaitingApprovel" element={<WaitingApprovel/>}/>
        <Route path="/InsuranceProvider" element={<InsuranceProvider/>}/>
        <Route path="/ForMailing" element={<ForMailing/>}/>
        <Route path="/SupplierTable" element={<SupplierTable/>}/>
        <Route path="/AddSupplier" element={<AddSupplier/>}/>
        <Route path="/InventoryMang" element={<InventoryMang/>}/>
        <Route path="/InventoryItems" element={<InventoryItems/>}/>
        <Route path="/OfferPage" element={<OfferPage/>}/>
        <Route path="/AddOffer" element={<AddOffer/>}/>
        <Route path="/Dialated" element={<Dialated/>}/>
        <Route path="/Keratometry" element={<Keratometry/>}/>
        <Route path="/Pachymetry" element={<Pachymetry/>}/>
        <Route path="/Eye" element={<Eye/>}/>
        <Route path="/CompanyPage" element={<Company/>}/>
        <Route path="/AddCompany" element={<AddCompany/>}/>
        <Route path="/UserPage" element={<User/>}/>
        <Route path="/AddUser" element={<AddUser/>}/>
        <Route path="/ConsultationBill" element={<ConsultationBill/>}/>
        <Route path="/Addkit" element={<AddKit/>}/>
        <Route path="/KitPage" element={<KitPage/>}/>

      <Route path="/profile" element={<ProfileContainer/>}/>

     <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
     <Route path="/ChangePassword" element={<ChangePassword/>}/>

     <Route path="/AddMedicinePage" element={<AddMedicinePage/>}/>
      <Route path="/MedicinePage" element={<MedicinePage/>}/>

      </Routes>
    </div>
  );
}

export default App;


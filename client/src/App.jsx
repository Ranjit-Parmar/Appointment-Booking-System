import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Wallet from './pages/Wallet';
import Layout from './components/Layout';
import DoctorListPage from './pages/DoctorListPage';
import FinancialReport from './pages/FinancialReport';
import UpcomingAppointment from './pages/UpcomingAppointment';
import PatientAppointment from './pages/PatientAppointment';
import Protected from './components/Protected';
import { Toaster } from 'react-hot-toast';
import DoctorDetailsPage from './pages/DoctorDetailsPage';
import DoctorProfile from './pages/DoctorProfile';
import ProtectedDoctorRoute from './components/ProtectedDoctorRoute';
import DoctorAvailability from './pages/DoctorAvailability';
import FinancialPagePatient from './pages/FinancialPagePatient';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Protected routes for authenticated users */}
          <Route path="/" element={<Protected><Home /></Protected>} />
          <Route path="/appointments/:id" element={<Protected><PatientAppointment /></Protected>} />
          <Route path="/wallet" element={<Protected><Wallet /></Protected>} />
          <Route path='/doctor_list' element={<Protected><DoctorListPage /></Protected>} />
          <Route path='/doctor_details/:id' element={<Protected><DoctorDetailsPage /></Protected>} />
          <Route path='/financial_report_patient' element={<Protected><FinancialPagePatient /></Protected>} />

          

          <Route path="/upcoming_appointment" element={<ProtectedDoctorRoute><UpcomingAppointment /></ProtectedDoctorRoute>} />

          <Route path='/dashboard' element={<DoctorDashboard/>}>
          <Route index element={<ProtectedDoctorRoute><DoctorProfile /></ProtectedDoctorRoute>} />
          <Route path='/dashboard/set-profile/:id' element={<ProtectedDoctorRoute><DoctorProfile /></ProtectedDoctorRoute>}/>
          <Route path='/dashboard/set_update_availability' element={<ProtectedDoctorRoute><DoctorAvailability /></ProtectedDoctorRoute>} />
          <Route path='/dashboard/financial_report_doctor' element={<ProtectedDoctorRoute><FinancialReport /></ProtectedDoctorRoute>} />
          <Route path='/dashboard/upcoming_appointments' element={<ProtectedDoctorRoute><UpcomingAppointment /></ProtectedDoctorRoute>} />
          <Route path='/dashboard/wallet' element={<ProtectedDoctorRoute><Wallet /></ProtectedDoctorRoute>} />
          </Route>

          
        </Route>
        
        {/* Public routes */}
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

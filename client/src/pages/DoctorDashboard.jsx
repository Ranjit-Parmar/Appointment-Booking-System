import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";

const DoctorDashboard = () => {

  const navigate = useNavigate();
  const {user} = useSelector((state)=>state.authReducer);

  useEffect(()=>{
    let user = JSON.parse(localStorage.getItem('user'));
    if(user.role !== 'doctor'){
      navigate('/', {replace:true});
    }
  },[])

  return (
   
      <div className="min-h-screen bg-gray-100 flex">
        {/* Static Sidebar */}
        <div className="w-64 bg-blue-800 text-white p-4">
          <h2 className="text-xl font-bold mb-4">Doctor Dashboard</h2>
          <ul>
            <li className="mb-2">
              <Link to={`set-profile/${user?._id}`} className="hover:text-yellow-500">Set Profile</Link>
            </li>
            <li className="mb-2">
              <Link to="set_update_availability" className="hover:text-yellow-500">Add/Update Availability</Link>
            </li>
            <li className="mb-2">
              <Link to="financial_report_doctor" className="hover:text-yellow-500">Financial Reports</Link>
            </li>
            <li className="mb-2">
              <Link to="upcoming_appointments" className="hover:text-yellow-500">Upcoming Appointments</Link>
            </li>
            <li className="mb-2">
              <Link to="Wallet" className="hover:text-yellow-500">Wallet</Link>
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <Outlet/>
        </div>
      </div>

  );
};

export default DoctorDashboard;

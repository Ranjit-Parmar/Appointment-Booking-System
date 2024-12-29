import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userLogIn, userLogOut } from '../redux/reducer/authReducer';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer); // Ensure user is properly set in Redux
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve user from localStorage
    if (user) {
      dispatch(userLogIn(user)); // Dispatch to set the user in Redux store
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      const option = {
        url: 'http://localhost:3000/api/v1/auth/logout',
        method: 'GET',
        withCredentials: true,
      };

      const responseData = await axios(option);

      if (responseData?.status === 200) {
        toast.success(responseData?.data?.message);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        dispatch(userLogOut());

        // Navigate to the login page after logout
        navigate('/login');  // Use navigate to redirect
      }
    } catch (error) {
      console.log(error);
      const { data } = error?.response;
      toast.error(data.message);
    }
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <Link to="/" className="text-lg font-bold">HealthConnect</Link>
        <div>
          {/* Common Navigation Links */}
          <Link to="/" className="mr-4">Home</Link>
          <Link to={`/appointments/${user?._id}`} className="mr-4">Appointments</Link>
          {user?.role === 'patient' && (
            <>
          <Link to="/wallet" className="mr-4">Wallet</Link>
          <Link to="/financial_report_patient" className="mr-4">Patient Report</Link>
            </>
          )}
          
          {/* Conditional Navigation Links based on Role */}
          {user?.role === 'doctor' && (
            <>
              <Link to="/dashboard" className="mr-4">Dashboard</Link>
            </>
          )}
          
          <button className="mr-4 text-white bg-red-500 p-2 rounded" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;












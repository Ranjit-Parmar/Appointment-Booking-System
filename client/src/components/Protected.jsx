import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUser, userLogIn, userLogOut } from "../redux/reducer/authReducer";

const Protected = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading } = useSelector((state) => state.authReducer);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    // If there's a token, check the user session
    if (token) {
      // Attempt to get the user data from your API or state
      const fetchUserData = async () => {
        try {
          const res = await getUser();  // Assuming `getUser` is an async function
          if (res?.data?.success) {
            // If user data is successfully fetched, log the user in
            dispatch(userLogIn(res?.data?.user));
          } else {
            // If the session is invalid, log the user out
            dispatch(userLogOut());
            localStorage.removeItem('user');
            localStorage.removeItem('auth_token');
            toast.error('Session expired. Please log in again.');
          }
        } catch (error) {
          // Handle any errors from the API request
          dispatch(userLogOut());
          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');
          toast.error('Failed to fetch user data. Please log in again.');
        }
      };

      fetchUserData();
    } else {
      // If no token, log out the user
      dispatch(userLogOut());
    }
  }, [dispatch]);

  // Show a loading indicator while checking authentication
  if (isLoading) {
    return <div>Loading...</div>; // Optionally, replace with a loading spinner
  }

  // If the user is not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }

  // Return the children (protected content) if the user is logged in
  return children;
};

export default Protected;

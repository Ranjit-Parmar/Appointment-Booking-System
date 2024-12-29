import React, { useEffect, useState } from "react";
import { Link, Navigate, } from "react-router-dom";
import { useSignupMutation } from "../redux/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { userLogIn } from "../redux/reducer/authReducer";

const SignUp = () => {

  const dispatch = useDispatch();
  const [signup] = useSignupMutation();
  const { isLoggedIn, user } = useSelector((state) => state.authReducer);
  const [disableButton, setDisableButton] = useState(false);
  const [userSignupData, setUserSignupData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
      // check if user data is stored in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        dispatch(userLogIn(JSON.parse(storedUser)));
      }
    }, [dispatch]);

    // If user is logged in, redirect to home
  if (isLoggedIn && user.role === 'patient') {
   return <Navigate to="/" replace={true} />;

  }else if(isLoggedIn){
    return <Navigate to="/doctor_availability" replace={true} />;
  }

  const inputChangeHandler = (e) => {
    setUserSignupData((pre) => {
      return { ...pre, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setDisableButton(true)

      const responseData = await signup(userSignupData);

      if (responseData?.data?.success) {
        const { data } = responseData;
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(userLogIn(data?.user));
        toast.success("user created successfully");
        setDisableButton(false);
        return <Navigate to="/login" replace={true} />;
      } else {
        const { data } = responseData?.error;
        toast.error(data.error);
        setDisableButton(false);
      }
    } catch (error) {
      console.log("fail ", error);
      setDisableButton(false);
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
                onChange={inputChangeHandler}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded"
                onChange={inputChangeHandler}
              />
            </div>
            <button
              type="submit"
              className={`${
                disableButton ? "pointer-events-none opacity-80" : ""} w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition-colors`}
            >
              {disableButton ? <ClipLoader color="#ffffff" size={20} /> : "Sign Up"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-gray-700 mr-2">Already have an account?</span>
            <Link to="/login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
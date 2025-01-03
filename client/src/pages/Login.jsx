import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useLoginMutation } from "../redux/api/authApi";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { userLogIn } from "../redux/reducer/authReducer";

const Login = () => {

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.authReducer);
  const [login] = useLoginMutation();

  const [disableButton, setDisableButton] = useState(false);
  const [userLoginData, setUserLoginData] = useState({
    email: "",
    password: "",
  });

  const inputChangeHandler = (e) => {
    setUserLoginData((pre) => {
      return { ...pre, [e.target.name]: e.target.value };
    });
  };


  useEffect(() => {
    // check if user data is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(userLogIn(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  // If user is logged in, redirect to home
  if (isLoggedIn) {    
    return <Navigate to="/" replace={true} />;
  }

  const handleSubmit = async (e) => {

    try {
      e.preventDefault();
      setDisableButton(true)

      const responseData = await login(userLoginData);

      if (responseData?.data?.success) {
        const { data } = responseData;       
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(userLogIn(data?.user));
        toast.success("user login successfully");
        setDisableButton(false);
        return <Navigate to="/" replace={true} />;

      } else {

        const { data } = responseData?.error;
        toast.error(data.message);
        setDisableButton(false);
        
      }
    } catch (error) {
      console.log("fail ", error);
      setDisableButton(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
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
            disabled={disableButton}
          >
             {disableButton ? <ClipLoader color="#ffffff" size={20} /> : "Log In"}
          </button>
        </form>
        <div className="mt-4 text-center flex flex-col">
          <div>
            <span className="mr-2">New to Helpdesk?</span>
            <Link to="/sign_up" className="text-blue-500 hover:underline mr-2">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

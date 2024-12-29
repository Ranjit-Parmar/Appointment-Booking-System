import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [firstTimeDiscount, setFirstTimeDiscount] = useState(true); // Assume first-time discount for demo

 

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col justify-center items-center text-white px-6">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to HealthConnect</h1>
      <p className="text-lg mb-8 text-center">
        Book appointments with ease and manage your health efficiently.
      </p>

      {/* Discount Banner Section */}
      {firstTimeDiscount && (
        <div className="bg-yellow-500 p-4 rounded-lg mb-6 max-w-md text-center shadow-xl">
          <h2 className="text-xl font-semibold mb-2">Special Offer for First-Time Patients!</h2>
          <p className="mb-4">Get 20% off your first consultation with any doctor!</p>
          <Link
            to="/doctor_list"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition duration-300"
          >
            Book Your Appointment Now
          </Link>
        </div>
      )}

      {/* Optional: You can also add a section here to show a few doctors */}
      <div className="text-center mt-10">
        <Link
          to="/doctor_list"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
        >
          View All Doctors
        </Link>
      </div>
    </div>
  );
};

export default Home;

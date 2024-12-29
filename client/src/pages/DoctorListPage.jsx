import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import doctor_avatar from '../assets/doctor_avatar.png';
import { useGetAllDoctorsQuery, useGetSpecializationQuery } from '../redux/api/doctorApi';
import Spinner from '../components/Spinner';

const DoctorListPage = () => {

  const [sortBy, setSortBy] = useState("");

  // Fetch doctors data from the backend
  const { data, isLoading, isError } = useGetAllDoctorsQuery(sortBy);
  const { data: specializationData, isLoading: specializationIsLoading, isError: specializationIsError } = useGetSpecializationQuery();

  if(isError || specializationIsError) return <div>Error...</div>;

  return (
    isLoading ? <Spinner/> : 
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Find a Doctor</h1>

      {/* Sort Dropdown */}
      <div className="mb-6">
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
        <select
          id="sortBy"
          value={sortBy}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Select...</option>
          {!specializationIsLoading && specializationData.specialization.map((val) => (  
            <option key={val._id} value={val.specialization}>{val.specialization}</option>
          ))}
        </select>
      </div>

      {/* Doctor List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {
          data.doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white p-4 rounded shadow-lg hover:shadow-xl transition-shadow"
            >
              <img src={doctor_avatar} alt="doctor_avatar" />
              <h3 className="text-xl font-semibold">{doctor.name}</h3>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="mt-2 text-gray-500">Location: {doctor.address}</p>
              <div className="mt-4">
                <Link
                  to={`/doctor_details/${doctor.doctorId}`}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default DoctorListPage;

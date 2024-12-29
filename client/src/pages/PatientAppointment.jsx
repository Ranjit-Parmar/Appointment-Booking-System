import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetAllPatientAppointmentsQuery } from '../redux/api/appointmentApi';
import Spinner from '../components/Spinner';

const PatientAppointment = () => {

  const {id} = useParams();
  const { data, isLoading, isError } = useGetAllPatientAppointmentsQuery(id);
  
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking the API call for appointments
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate an API delay of 2 seconds
  }, []);

  if (loading){
    return <Spinner/> // Loading spinner
  } 
  

  return (
    isLoading? "Loading..." :
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Appointments</h1>

      {data?.appointments?.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-lg">You don't have any upcoming appointments.</p>
          <Link
            to="/doctor_list"
            className="mt-4 inline-block px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
          >
            Book an Appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {data?.appointments?.map((appointment) => {
           
            return (
              <div
                key={appointment._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-semibold text-gray-800">{appointment?.doctorId?.name}</h3>
                    <p className="text-gray-600 mt-1">{appointment?.doctorId?.specialization}</p>
                  </div>
                  <div className="text-right text-gray-600">
                    <p>
                      Status:{' '}
                      <span
                        className={`font-semibold text-${appointment?.status === 'scheduled' ? 'green' : 'yellow'}-600`}
                      >
                        {appointment?.status}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">Date: {new Date(appointment?.date).toLocaleDateString()}</p>
                <p className="text-gray-600">Time: {appointment?.time}</p>
                <div className="mt-4">
                  <p className="text-gray-800 font-semibold">Consultation Fee: ${appointment?.consultationFee}</p>
                  {/* {appointment.discount > 0 ? (
                    <p className="text-green-500 mt-2">
                      Discount Applied: {appointment.discount}% off - New Price: ${discountedPrice.toFixed(2)}
                    </p>
                  ) : null} */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientAppointment;

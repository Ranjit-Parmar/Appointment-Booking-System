import React, { useEffect, useState } from 'react';
import { useDeleteAppointmentMutation, useGetAllDoctorAppointmentsQuery, useUpdateAppointmentStatusMutation } from '../redux/api/appointmentApi';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const UpcomingAppointment = () => {

  const { user } = useSelector((state) => state.authReducer);

  const { data, isLoading, isError, error } = useGetAllDoctorAppointmentsQuery(user?._id);
  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();


  // Handle the status change (e.g., mark appointment as complete)
  const handleStatusChange = async(appointmentId, status) => {
    try {
    const updatedAppointmentStatusResponse = await updateAppointmentStatus({appointmentId,status}).unwrap();

    if(updatedAppointmentStatusResponse.success){
      toast.success(updatedAppointmentStatusResponse.message)
    };
    
    } catch (error) {
      toast.error('Something went wrong!')
      console.log(error);
      
    }
   
  };

  // Handle appointment deletion
  const handleDelete = async(appointmentId) => {
    try {
      const deletedAppointmentResponse = await deleteAppointment(appointmentId).unwrap();
  
      if(deletedAppointmentResponse.success){
        toast.success(deletedAppointmentResponse.message)
      };
      
      } catch (error) {
        toast.error('Something went wrong!')
        console.log(error);
        
      }
  };

  if(isError){
    toast.error('Something went wrong');
  }

  return isLoading ? <Spinner /> : (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>

      <div className="bg-white p-4 rounded shadow-md">
        {data?.appointments?.length > 0 ? (
          <table className="min-w-full table-auto bg-white border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border">Patient email</th>
                <th className="px-4 py-2 text-left border">Date</th>
                <th className="px-4 py-2 text-left border">Time</th>
                <th className="px-4 py-2 text-left border">Status</th>
                <th className="px-4 py-2 text-left border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.appointments?.map(({ bookedAppointments }) =>
                bookedAppointments.map(({_id, patientId, date, time, status }, index) => (
                  <tr key={`${_id}-${patientId._id}-${index}`} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{patientId.email}</td>
                    <td className="px-4 py-2 border">{new Date(date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{time}</td>
                    <td className="px-4 py-2 border">{status}</td>
                    <td className="px-4 py-2 border">
                      {status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusChange(_id,"completed")}
                          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                        >
                          Mark as Completed
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(_id)}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <p>No upcoming appointments.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointment;

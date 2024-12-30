import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGetDoctorDetailsQuery, useUpdateDoctorAvailabilityMutation } from '../redux/api/doctorApi';
import { useSelector } from 'react-redux';

const DoctorAvailability = () => {
  const { user } = useSelector((state) => state.authReducer);
  const [availability, setAvailability] = useState([]); // Store time slots
  const [currentTime, setCurrentTime] = useState(getCurrentTime()); // Get current time
  const [updateDoctorAvailability] = useUpdateDoctorAvailabilityMutation();
  const { data, isLoading, isError, error } = useGetDoctorDetailsQuery(user?._id);
  const navigate = useNavigate();

  // Get the current time formatted to HH:MM
  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Helper function to convert 24-hour time to 12-hour format
  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    minutes = minutes.padStart(2, '0');
    return `${hours}:${minutes} ${period}`;
  };

  // Helper function to convert 12-hour time back to 24-hour format
  const convertTo24HourFormat = (time) => {
    const [hourMinute, period] = time.split(' ');
    let [hours, minutes] = hourMinute.split(':');
    hours = parseInt(hours, 10);
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    minutes = minutes.padStart(2, '0');
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  // Set initial availability from the fetched data 
  useEffect(() => {
    if (data && data?.doctor?.available) {
      const initialAvailability = data.doctor.available.map((slot) => convertTo24HourFormat(slot.time));
      setAvailability(initialAvailability);
    }
  }, [data]);

  // Error handling when the doctor profile is not found
  useEffect(() => {
    if (isError) {
      if (error?.status === 404) {
        navigate(`/dashboard/set-profile/${user?._id}`); 
        toast.error('Please set up your profile first');
      }
    }
  }, [isError, error, navigate, user?._id]);

  // Handle availability time slot change
  const handleAvailabilityChange = (e, index) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index] = e.target.value;
    setAvailability(updatedAvailability);
  };

  // Add a new time slot
  const handleAddTimeSlot = () => {
    setAvailability([...availability, '']); // Add an empty string as a new time slot
  };

  // Remove a time slot by index
  const handleRemoveTimeSlot = (index) => {
    const updatedAvailability = availability.filter((_, i) => i !== index);
    setAvailability(updatedAvailability);
  };

  // Helper function to check if the time is expired
  const isExpired = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const currentInMinutes = parseInt(currentTime.split(':')[0], 10) * 60 + parseInt(currentTime.split(':')[1], 10);
    return timeInMinutes < currentInMinutes;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (availability.length === 0) {
      toast.error('Please add at least one time slot.');
      return;
    }

    // Filter out empty time slots
    let validAvailability = availability.filter((time) => time.trim() !== '');
    if (validAvailability.length === 0) {
      toast.error('Please add valid time slots.');
      return;
    }

    // Convert times to 12-hour AM/PM format before saving
    validAvailability = validAvailability.map((time) => ({
      time: convertTo12HourFormat(time),
    }));

    const doctorAvailabilityData = {
      doctorId: user?._id,
      available: validAvailability,
    };

    try {
      const responseAvailabilityData = await updateDoctorAvailability(doctorAvailabilityData);
      if (responseAvailabilityData?.data?.success) {
        toast.success('Availability updated successfully!');
      } else {
        toast.error('Failed to update availability.');
      }
    } catch (error) {
      toast.error('Error while updating availability');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Set Your Availability</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        
        {/* Table Structure for Time Slots */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">Time Slot</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availability.map((time, index) => {
                const expired = isExpired(time);
                return (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => handleAvailabilityChange(e, index)}
                        className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={currentTime} // Minimum time is current time
                        required
                      />
                    </td>
                    <td className={`py-2 px-4 ${expired ? 'text-red-500' : 'text-green-500'}`}>
                      {expired ? 'Expired' : 'Valid'}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveTimeSlot(index)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add New Time Slot Button */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleAddTimeSlot}
            className="bg-green-500 text-white py-2 px-4 rounded-lg"
          >
            Add Time Slot
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 ease-in-out hover:bg-blue-600"
        >
          Save Availability
        </button>
      </form>
    </div>
  );
};

export default DoctorAvailability;

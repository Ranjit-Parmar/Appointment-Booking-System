import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetDoctorDetailsQuery } from "../redux/api/doctorApi";
import { useBookAppointmentMutation } from "../redux/api/appointmentApi";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disableButton, setDisableButton] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [doctorBookedAppointments, setDoctorBookedAppointments] = useState([]);
  const { user } = useSelector((state) => state.authReducer);
  const { data, isLoading, isError } = useGetDoctorDetailsQuery(id);
  const [bookAppointment] = useBookAppointmentMutation();

  // Convert the date to YYYY-MM-DD format
  const convertDateFormat = () => {
    let dateStr = new Date().toLocaleDateString();
    const [month, day, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // Convert 24-hour time to 12-hour format (AM/PM)
  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight (00:00)
    minutes = minutes.padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Parse "hh:mm AM/PM" into minutes for easier comparison
  const parseTimeToMinutes = (timeString) => {
    let [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Check if the time is valid and in the future
  const checkTimeValidity = (savedTime) => {
    const currentTimeInMinutes =
      new Date().getHours() * 60 + new Date().getMinutes();
    const savedTimeInMinutes = parseTimeToMinutes(savedTime);
    return savedTimeInMinutes > currentTimeInMinutes;
  };

  // Check if the time is available and not already booked
  const checkTimeAvailability = (time) => {
    const isValid = checkTimeValidity(time);
    const isBooked = doctorBookedAppointments.includes(time);
    return isValid && !isBooked;
  };

  useEffect(() => {
    if (data) {
      setDoctorBookedAppointments(
        data.doctor.bookedAppointments.map((appointment) => appointment.time)
      );
    }
  }, [data]);

  const handleSubmit = async () => {
    setDisableButton(true);
    try {
      const responseData = await bookAppointment({
        doctorId: id,
        patientId: user._id,
        date: `${convertDateFormat()} ${selectedTime}`,
        time: selectedTime,
        consultationFee: 100,
      }).unwrap();
      console.log(responseData);

      toast.success(responseData.message);
      setDisableButton(false);
      navigate(`/appointments/${user?._id}`, { replace: true });
    } catch (error) {
      setDisableButton(false);
      if(error.status===400 && error?.data?.message==='Insufficient balance'){
        toast.error('Insufficient balance. Keep sufficient amount in your wallet');
      
        if(user.role==='patient'){
          navigate('/wallet');
        }else{
          navigate('/dashboard/wallet');
        };
        
      }else{
            toast.error("Something went wrong! Try again.");
      }
    }
  };

  // Format phone number for display
  const formatPhoneNumber = (phoneNumber) => {
    const phoneString = phoneNumber.toString();
    return `(${phoneString.slice(0, 3)}) ${phoneString.slice(3, 6)}-${phoneString.slice(6)}`;
  };

  // Get today's date
  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return isLoading ? (
    <Spinner />
  ) : isError ? (
    "Error..."
  ) : (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Doctor Details</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Doctor Info */}
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">{data?.doctor?.name}</h2>
          <p className="text-gray-600 mt-2">
            Specialization:{" "}
            <span className="font-medium">{data?.doctor?.specialization}</span>
          </p>
          <p className="text-gray-600 mt-2">
            Phone:{" "}
            <span className="font-medium">
              {formatPhoneNumber(data?.doctor?.phone)}
            </span>
          </p>
          <p className="text-gray-600 mt-2">
            Address:{" "}
            <span className="font-medium">{data?.doctor?.address}</span>
          </p>
          <p className="text-gray-600 mt-2">
            Consultation Fee:{" "}
            <span className="font-medium">
              ${data?.doctor?.consultationFee}
            </span>
          </p>
        </div>

        {/* Available Times */}
        <div className="bg-white p-6 rounded shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Available Times</h3>
          <p className="text-lg text-gray-600 mb-4">{getTodayDate()}</p>
          <div className="grid grid-cols-3 gap-2">
            {data?.doctor?.available?.length > 0 ? (
              data.doctor.available.map(({ time }) => (
                <div key={time} className="w-full border-2">
                  <button
                    className={`${
                      checkTimeAvailability(time)
                        ? "bg-green-500"
                        : "pointer-events-none"
                    } p-2 w-full text-sm ${
                      selectedTime === time
                        ? "bg-blue-900 text-white"
                        : "bg-gray-200 hover:bg-green-600"
                    }`}
                    onClick={() => {
                      setSelectedTime(time);
                    }}
                  >
                    {convertTo12HourFormat(time)} {/* Show in 12-hour format */}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-red-500">No available times</p>
            )}
          </div>
        </div>
      </div>

      {/* Book Appointment Button */}
      <div className="mt-6 flex justify-center">
        <button
          className={`${
            !selectedTime ||
            disableButton ||
            !checkTimeAvailability(selectedTime)
              ? "opacity-60 pointer-events-none"
              : ""
          } px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300`}
          disabled={!selectedTime || !checkTimeAvailability(selectedTime)}
          onClick={handleSubmit}
        >
          {disableButton ? (
            <ClipLoader color="#ffffff" size={20} />
          ) : (
            "Confirm Appointment"
          )}
        </button>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;

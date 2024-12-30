import React, { useEffect, useState } from 'react';
import { useCreateDoctorProfileMutation, useUpdateDoctorProfileMutation } from '../redux/api/doctorApi';
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetDoctorDetailsQuery } from '../redux/api/doctorApi';

const DoctorProfile = () => {

  const {id} = useParams();
  const [mode, setMode] = useState('create');
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const navigate = useNavigate();


  const {user} = useSelector((state)=>state.authReducer);
  const {data, isLoading, isError} = useGetDoctorDetailsQuery(user?._id);
  const [createDoctorProfile] = useCreateDoctorProfileMutation();  
  const [updateDoctorProfile] = useUpdateDoctorProfileMutation();

  useEffect(()=>{
    if(data){
      setMode('update');
      setName(data?.doctor?.name);
      setSpecialization(data?.doctor?.specialization);
      setAddress(data?.doctor?.address);
      setPhone(data?.doctor?.phone);
      setConsultationFee(data?.doctor?.consultationFee);
    }else{
      setMode('create');
      setName('');
      setSpecialization('');
      setAddress('');
      setPhone('');
      setConsultationFee('');
    }
  },[data]);

 
  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
        if(mode==='create'){
          let profileData = {
            name,
            specialization,
            address,
            phone,
            consultationFee,
            doctorId : id || user?._id
          };
          
          const setDoctorProfileResponse = await createDoctorProfile(profileData).unwrap();
      
          
         if(setDoctorProfileResponse?.success){
             toast.success(setDoctorProfileResponse?.message);
             navigate('/dashboard/set_update_availability');
         }
        }else{
          let profileData = {
            name,
            specialization,
            address,
            phone,
            consultationFee,
            doctorId : id || user?._id
          };
          
          const updateDoctorProfileResponse = await updateDoctorProfile(profileData).unwrap();
      
          
         if(updateDoctorProfileResponse?.success){
             toast.success(updateDoctorProfileResponse?.message);
             navigate('/dashboard/set_update_availability');
         }
        }
        
         

    } catch (error) {
        toast.error('Something went wrong! Try again');
    }

  };
     
  

 
  return (
    <div className="container mx-auto p-6 sm:p-8 md:p-10 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">{mode==='create'?'Set Your Profile':'Update Your Profile'}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="specialization" className="block text-gray-700 mb-2">Specialization</label>
          <input
            type="text"
            id="specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter your specialization"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-gray-700 mb-2">Address</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter your clinic address"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label htmlFor="consultationFee" className="block text-gray-700 mb-2">Consultation Fee (₹)</label>
          <input
            type="number"
            id="consultationFee"
            value={consultationFee}
            onChange={(e) => setConsultationFee(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter your consultation fee"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 ease-in-out hover:bg-blue-600"
        >
          {mode==='create'?'Save Profile':'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default DoctorProfile;

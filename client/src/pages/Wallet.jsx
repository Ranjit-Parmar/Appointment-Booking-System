import React, { useEffect, useState } from 'react';
import { useAddMoneyToWalletMutation } from '../redux/api/walletApi';
import { useSelector } from 'react-redux';
import { getUser } from '../redux/reducer/authReducer';
import toast from "react-hot-toast";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amountToAdd, setAmountToAdd] = useState('');
  const { user } = useSelector((state)=>state.authReducer);
  const [addMoneyToWallet] = useAddMoneyToWalletMutation();


  useEffect(()=>{
    getUser().then((res)=>{
      const {user} = res?.data
      setBalance(user.walletBalance);
    }).catch((e)=>{
     console.log(e);    
    });
  },[amountToAdd])
      

  const handleAddAmount = async(e) => {
    e.preventDefault();
    
    try {
      const walletResponse = await addMoneyToWallet({patientId : user?._id, amount : Number(amountToAdd)}).unwrap();
      toast.success(walletResponse.message);
      setAmountToAdd('');
      
    } catch (error) {
      toast.error("Something went wrong! Try again");
      setAmountToAdd('');
    }
    
    
  };

  return (
    <form className="container mx-auto p-6 sm:p-8 md:p-10 max-w-md bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Wallet</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Current Balance: ₹{balance}</h3>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Add Amount</label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={amountToAdd}
            onChange={(e) => setAmountToAdd(e.target.value)}
            required
            placeholder="Enter amount"
          />
        </div>
        <button
          onClick={handleAddAmount}
          disabled={!amountToAdd || parseFloat(amountToAdd) <= 0}
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add Amount
        </button>
      </div>
    </form>
  );
};

export default Wallet;

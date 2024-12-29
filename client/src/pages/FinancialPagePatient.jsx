import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { usePatientFinancialReportQuery } from '../redux/api/transactionApi'; // assuming you have a query to fetch patient financial data
import Spinner from '../components/Spinner';

const FinancialPagePatient = () => {
  const { user } = useSelector((state) => state.authReducer);
  const [filter, setFilter] = useState('monthly'); // Default filter is monthly
  const [patientId, setPatientId] = useState(''); // Patient ID to pass as a parameter
  const { data, isLoading, isError, error } = usePatientFinancialReportQuery({ patientId: user?._id, filter });

  useEffect(() => {
    if (user) {
      setPatientId(user._id); // Assuming user._id is the patient's ID
    }

    if (isError) {
      toast.error('Error fetching financial data');
    }
  }, [user, isError]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  if (isLoading) {
    return <Spinner/>;
  }
  

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Patient Financial Report</h2>
      
      {/* Filter Section */}
      <div className="flex justify-between items-center mb-6">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="border p-2 rounded-lg shadow-sm focus:outline-none"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <div className="font-semibold text-xl text-green-600">
          Total Spent: Rs.{data?.report?.totalSpent || 0}
        </div>
        <div className="font-semibold text-xl text-blue-600">
            Total Discount: Rs.
            {data?.discounts || 0} {/* Display the total discount */}
            </div>
                </div>

      {/* Patient Financial Overview */}
      <div className="mb-6">
        <div className="font-semibold text-xl text-blue-600">
          Total Spent: Rs.{data?.report?.totalSpent || 0}
        </div>
        <div className="font-semibold text-xl text-green-600">
          Total Credit: Rs.{data?.report?.totalCredit || 0}
        </div>
        <div className="font-semibold text-xl text-red-600">
          Total Debit: Rs.{data?.report?.totalDebit || 0}
        </div>
        <div className="font-semibold text-xl text-purple-600">
          Total Transactions: {data?.report?.transactionCount || 0}
        </div>
      </div>

      {/* Transaction Details Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Transaction Type</th>
              <th className="px-4 py-2 text-left">Transaction Amount</th>
              <th className="px-4 py-2 text-left">Transaction Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.report?.transactionDetails && data.report.transactionDetails.length > 0 ? (
              data.report.transactionDetails.map((transaction, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{transaction.transactionType}</td>
                  <td className="px-4 py-2">Rs.{transaction.transactionAmount}</td>
                  <td className="px-4 py-2">{new Date(transaction.transactionDate).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                  No transaction details available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialPagePatient;

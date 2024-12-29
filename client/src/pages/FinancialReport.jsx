import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useDoctorFinancialReportQuery } from '../redux/api/transactionApi';
import Spinner from '../components/Spinner';

const FinancialReport = () => {
  const { user } = useSelector((state) => state.authReducer);
  const [filter, setFilter] = useState('monthly'); // Default filter is monthly
  const [totalEarnings, setTotalEarnings] = useState(0);
  const { data, isLoading, isError, error } = useDoctorFinancialReportQuery({ doctorId: user?._id, filter });

 
  useEffect(() => {
    if (data) {
      setTotalEarnings(data.report.reduce((acc, val)=>{
           return acc + (val.totalEarnings || 0);
      },0)); // Sum of all totalEarnings
    }

    if (isError) {
      toast.error('Error fetching financial data');
    }
  }, [data, isError]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  if (isLoading) {
    return <Spinner/>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Your Financial Report</h2>

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
          Total Earnings: Rs.{totalEarnings}
        </div>
        <div className="font-semibold text-xl text-blue-600">
            Total Discount: Rs.
            {data?.discounts || 0} {/* Display the total discount */}
            </div>
      </div>



      {/* Financial Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Patient ID</th>
              <th className="px-4 py-2 text-left">Total Earnings</th>
              <th className="px-4 py-2 text-left">Total Transactions</th>
              <th className="px-4 py-2 text-left">Transaction Type</th>
              <th className="px-4 py-2 text-left">Transaction Amount</th>
              <th className="px-4 py-2 text-left">Transaction Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.report?.length > 0 ? (
              data.report.map((patientReport, index) => (
                <React.Fragment key={index}>
                  {patientReport.transactionDetails.map((transaction, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2">{patientReport.patientId}</td>
                      <td className="px-4 py-2">Rs.{patientReport.totalEarnings}</td>
                      <td className="px-4 py-2">{patientReport.totalTransactions}</td>
                      <td className="px-4 py-2">{transaction.transactionType}</td>
                      <td className="px-4 py-2">Rs.{transaction.transactionAmount}</td>
                      <td className="px-4 py-2">{new Date(transaction.transactionDate).toLocaleString()}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                  No financial data found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialReport;

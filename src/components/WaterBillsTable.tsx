'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/AuthContext';
import { useTheme } from '@/utils/ThemeContext';
import { supabase } from '@/utils/supabase';
import { Tables } from '@/types/supabase';

type WaterBill = Tables<'water_bills'>;

export default function WaterBillsTable() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [bills, setBills] = useState<WaterBill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editBill, setEditBill] = useState<WaterBill | null>(null);
  const [formData, setFormData] = useState({
    month: '',
    amount: '',
    previous_reading: '',
    current_reading: '',
    consumption: '',
    rate: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof WaterBill>('month');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('water_bills')
        .select('*')
        .eq('user_id', user.id)
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (error) {
        throw error;
      }

      setBills(data || []);
    } catch (err) {
      console.error('Error fetching water bills:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBills();
    }
  }, [user, sortField, sortDirection]);

  const handleSort = (field: keyof WaterBill) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError(null);

      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Calculate consumption
      const previousReading = parseFloat(formData.previous_reading);
      const currentReading = parseFloat(formData.current_reading);
      const consumption = currentReading - previousReading;
      const rate = parseFloat(formData.rate);

      const newBill = {
        user_id: user.id,
        month: formData.month,
        previous_reading: previousReading,
        current_reading: currentReading,
        consumption: consumption,
        rate: rate,
        amount: parseFloat(formData.amount)
      };

      const { error } = await supabase
        .from('water_bills')
        .insert([newBill]);

      if (error) {
        throw error;
      }

      // Reset form and fetch updated bills
      setFormData({
        month: '',
        amount: '',
        previous_reading: '',
        current_reading: '',
        consumption: '',
        rate: ''
      });
      setShowAddForm(false);
      fetchBills();

    } catch (err) {
      console.error('Error adding water bill:', err);
      setError((err as Error).message);
    }
  };

  const handleEditBill = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError(null);

      if (!user || !editBill) {
        setError('User not authenticated or bill not selected');
        return;
      }

      // Calculate consumption
      const previousReading = parseFloat(formData.previous_reading);
      const currentReading = parseFloat(formData.current_reading);
      const consumption = currentReading - previousReading;
      const rate = parseFloat(formData.rate);

      const updatedBill = {
        month: formData.month,
        previous_reading: previousReading,
        current_reading: currentReading,
        consumption: consumption,
        rate: rate,
        amount: parseFloat(formData.amount)
      };

      const { error } = await supabase
        .from('water_bills')
        .update(updatedBill)
        .eq('id', editBill.id);

      if (error) {
        throw error;
      }

      // Reset form and fetch updated bills
      setFormData({
        month: '',
        amount: '',
        previous_reading: '',
        current_reading: '',
        consumption: '',
        rate: ''
      });
      setShowEditForm(false);
      setEditBill(null);
      fetchBills();

    } catch (err) {
      console.error('Error updating water bill:', err);
      setError((err as Error).message);
    }
  };

  const handleDeleteBill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bill?')) {
      return;
    }

    try {
      setError(null);

      if (!user) {
        setError('User not authenticated');
        return;
      }

      const { error } = await supabase
        .from('water_bills')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      fetchBills();

    } catch (err) {
      console.error('Error deleting water bill:', err);
      setError((err as Error).message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    // Auto-calculate consumption and amount when previous_reading, current_reading, or rate changes
    if (name === 'previous_reading' || name === 'current_reading' || name === 'rate') {
      const previousReading = parseFloat(name === 'previous_reading' ? value : formData.previous_reading) || 0;
      const currentReading = parseFloat(name === 'current_reading' ? value : formData.current_reading) || 0;
      const rate = parseFloat(name === 'rate' ? value : formData.rate) || 0;

      // Calculate consumption (ensure it's not negative)
      const consumption = Math.max(0, currentReading - previousReading);
      updatedFormData.consumption = consumption.toString();

      // Calculate amount based on consumption and rate
      if (consumption > 0 && rate > 0) {
        const calculatedAmount = (consumption * rate).toFixed(2);
        updatedFormData.amount = calculatedAmount;
      }
    }

    setFormData(updatedFormData);
  };

  const findMostRecentBill = () => {
    if (bills.length === 0) return null;

    // Sort bills by month in descending order
    return [...bills].sort((a, b) => {
      // Compare YYYY-MM format dates
      return b.month.localeCompare(a.month);
    })[0];
  };

  const startAddBill = () => {
    const mostRecentBill = findMostRecentBill();
    const defaultPreviousReading = mostRecentBill ? mostRecentBill.current_reading.toString() : '';

    // Get current year and month for default selection
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const defaultMonth = `${currentYear}-${currentMonth}`;

    setFormData({
      month: defaultMonth,
      amount: '',
      previous_reading: defaultPreviousReading,
      current_reading: '',
      consumption: '',
      rate: ''
    });

    setShowAddForm(true);
  };

  const startEditBill = (bill: WaterBill) => {
    setEditBill(bill);
    setFormData({
      month: bill.month,
      amount: bill.amount.toString(),
      previous_reading: bill.previous_reading.toString(),
      current_reading: bill.current_reading.toString(),
      consumption: bill.consumption.toString(),
      rate: bill.rate.toString()
    });
    setShowEditForm(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatMonth = (monthString: string) => {
    // Check if in YYYY-MM format
    if (/^\d{4}-\d{2}$/.test(monthString)) {
      const [year, month] = monthString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return monthString;
  };

  const formatNumber = (value: number) => {
    // Convert to a string with 2 decimal places
    const formatted = value.toFixed(2);

    // If it ends with .00, remove the decimal part
    if (formatted.endsWith('.00')) {
      return formatted.slice(0, -3);
    }

    // Otherwise return with decimals
    return formatted;
  };

  // Filter bills based on search term and selected year
  const filteredBills = bills.filter(bill => {
    // First filter by year
    const billYear = parseInt(bill.month.split('-')[0]);
    if (billYear !== selectedYear) {
      return false;
    }

    // Then filter by search term (if any)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const month = bill.month.toLowerCase();
      const amount = bill.amount.toString();
      const consumption = bill.consumption.toString();

      return (
        month.includes(searchLower) ||
        amount.includes(searchLower) ||
        consumption.includes(searchLower)
      );
    }

    return true;
  });

  // Calculate statistics
  const totalBills = filteredBills.length;
  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
  const averageAmount = totalBills > 0 ? totalAmount / totalBills : 0;
  const totalConsumption = filteredBills.reduce((sum, bill) => sum + bill.consumption, 0);
  const averageConsumption = totalBills > 0 ? totalConsumption / totalBills : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add global style to hide number input spinners */}
      <style jsx global>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      <h1 className={`
        text-3xl font-bold mb-6 bg-clip-text text-transparent animate-gradient-shift
        ${darkMode
          ? 'bg-gradient-to-r from-blue-300 via-cyan-400 to-sky-400'
          : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500'
        }
      `}>
        Water Bills
        <span className="inline-block ml-2 animate-pulse-slow">
          <svg className="w-8 h-8 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
          </svg>
        </span>
      </h1>

      {error && (
        <div className={`
          border-l-4 p-4 mb-6 animate-fade-in
          ${darkMode
            ? 'bg-red-900/30 border-red-500 text-red-400'
            : 'bg-red-100 border-red-500 text-red-700'
          }
        `} role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        {/* Year Selector */}
        <div className="flex items-center">
          <label className={`mr-2 font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
            Selected Year:
          </label>
          <div className="relative group">
            <div className={`absolute -inset-0.5 rounded-lg opacity-70 blur-sm transition-all duration-300 group-hover:opacity-100
              ${darkMode
                ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 animate-gradient-shift'
                : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-gradient-shift'
              }
            `}></div>
            <select
              className={`
                relative px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-300 transform hover:scale-105
                ${darkMode
                  ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700 text-white'
                  : 'bg-gradient-to-r from-white via-blue-50 to-white border border-gray-300 text-gray-800'}
              `}
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {/* Future years */}
              <option value={currentYear + 10}>{currentYear + 10}</option>
              <option value={currentYear + 9}>{currentYear + 9}</option>
              <option value={currentYear + 8}>{currentYear + 8}</option>
              <option value={currentYear + 7}>{currentYear + 7}</option>
              <option value={currentYear + 6}>{currentYear + 6}</option>
              <option value={currentYear + 5}>{currentYear + 5}</option>
              <option value={currentYear + 4}>{currentYear + 4}</option>
              <option value={currentYear + 3}>{currentYear + 3}</option>
              <option value={currentYear + 2}>{currentYear + 2}</option>
              <option value={currentYear + 1}>{currentYear + 1}</option>
              {/* Current year */}
              <option value={currentYear}>{currentYear}</option>
            </select>
          </div>
        </div>

        <button
          className={`
            relative overflow-hidden group rounded-lg font-bold py-2 px-4
            flex items-center justify-center transition-all duration-300
            transform hover:scale-105 animate-gradient-shift
            ${darkMode
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
              : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
            }
          `}
          onClick={startAddBill}
        >
          <span className="relative z-10 flex items-center">
            <svg className="w-5 h-5 mr-2 group-hover:animate-bounce-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Add Water Bill</span>
          </span>
          <span className="absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 bg-white"></span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white"></div>
        </button>
      </div>

      {/* Add Bill Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className={`
            relative overflow-hidden rounded-xl shadow-2xl p-6 w-full max-w-md
            ${darkMode
              ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 text-white'
              : 'bg-white rounded-lg shadow-xl text-gray-800'
            }
          `}>
            <div className="flex items-center mb-6">
              <div className="bg-blue-400 p-2 rounded-md mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Add New Water Bill</h2>
            </div>

            <form onSubmit={handleAddBill} className="space-y-4">
              <div>
                <label className={`block font-medium mb-2 ${darkMode ? 'text-blue-300' : 'text-gray-700'}`}>
                  Month <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 rounded-lg opacity-70 blur-sm transition-all duration-300 group-hover:opacity-100 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 animate-gradient-shift"></div>
                    <select
                      className={`
                        relative w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                        transition-all duration-300 transform hover:scale-105
                        ${darkMode
                          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700 text-white'
                          : 'bg-gradient-to-r from-white via-blue-50 to-white border-gray-300 text-gray-800'
                        }
                      `}
                      required
                      value={formData.month.split('-')[1] || ''}
                      onChange={e => {
                        const year = formData.month.split('-')[0] || new Date().getFullYear().toString();
                        setFormData({...formData, month: `${year}-${e.target.value}`});
                      }}
                    >
                    <option value="">Select Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 rounded-lg opacity-70 blur-sm transition-all duration-300 group-hover:opacity-100 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 animate-gradient-shift"></div>
                    <select
                      className={`
                        relative w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                        transition-all duration-300 transform hover:scale-105
                        ${darkMode
                          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700 text-white'
                          : 'bg-gradient-to-r from-white via-blue-50 to-white border-gray-300 text-gray-800'
                        }
                      `}
                      required
                      value={formData.month.split('-')[0] || ''}
                      onChange={e => {
                        const month = formData.month.split('-')[1] || '01';
                        setFormData({...formData, month: `${e.target.value}-${month}`});
                      }}
                    >
                    {/* Future years */}
                    <option value={new Date().getFullYear() + 10}>{new Date().getFullYear() + 10}</option>
                    <option value={new Date().getFullYear() + 9}>{new Date().getFullYear() + 9}</option>
                    <option value={new Date().getFullYear() + 8}>{new Date().getFullYear() + 8}</option>
                    <option value={new Date().getFullYear() + 7}>{new Date().getFullYear() + 7}</option>
                    <option value={new Date().getFullYear() + 6}>{new Date().getFullYear() + 6}</option>
                    <option value={new Date().getFullYear() + 5}>{new Date().getFullYear() + 5}</option>
                    <option value={new Date().getFullYear() + 4}>{new Date().getFullYear() + 4}</option>
                    <option value={new Date().getFullYear() + 3}>{new Date().getFullYear() + 3}</option>
                    <option value={new Date().getFullYear() + 2}>{new Date().getFullYear() + 2}</option>
                    <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
                    {/* Current year */}
                    <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                  </select>
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  <span className={`block font-medium ${darkMode ? 'text-blue-300' : 'text-gray-700'}`}>Previous Reading (m³)</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    id="previous_reading"
                    name="previous_reading"
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    value={formData.previous_reading}
                    onChange={handleChange}
                    required
                  />
                  <span className="absolute right-3 top-2 text-gray-500">m³</span>
                </div>
              </div>

              <div className="relative">
                <label className={`block font-medium mb-1 ${darkMode ? 'text-blue-300' : 'text-gray-700'}`}>
                  Current Reading (m³)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="current_reading"
                    name="current_reading"
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    value={formData.current_reading}
                    onChange={handleChange}
                    required
                  />
                  <span className="absolute right-3 top-2 text-gray-500">m³</span>
                </div>
              </div>

              <div className="relative">
                <label className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                  </svg>
                  <span className={`block font-medium ${darkMode ? 'text-blue-300' : 'text-gray-700'}`}>Actual Consumption (m³)</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    id="consumption"
                    name="consumption"
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${darkMode
                        ? 'bg-gray-900 border-gray-700 text-blue-400'
                        : 'bg-gray-100 border-gray-300 text-gray-800'
                      }`}
                    value={formatNumber(Math.max(0, parseFloat(formData.current_reading || '0') - parseFloat(formData.previous_reading || '0')))}
                    readOnly
                  />
                  <span className="absolute right-3 top-2 text-gray-500">m³</span>
                </div>
              </div>

              <div className="relative">
                <label className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h5.586a1 1 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                  </svg>
                  <span className={`block font-medium ${darkMode ? 'text-blue-300' : 'text-gray-700'}`}>Your Rate This Month (₱ per m³)</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    id="rate"
                    name="rate"
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${darkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    value={formData.rate}
                    onChange={handleChange}
                    required
                  />
                  <span className="absolute right-3 top-2 text-gray-500">₱/m³</span>
                </div>
              </div>

              <div className="relative">
                <label className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  <span className={`block font-medium ${darkMode ? 'text-blue-300' : 'text-gray-700'}`}>Total Amount (₱) <span className="text-red-500">*</span></span>
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${darkMode
                        ? 'bg-gray-900 border-gray-700 text-red-400'
                        : 'bg-gray-100 border-gray-300 text-gray-800'
                      }`}
                    value={formData.amount ? formatNumber(parseFloat(formData.amount)) : ''}
                    readOnly
                  />
                  <span className="absolute right-3 top-2 text-gray-500">₱</span>
                </div>
              </div>

              <div className="flex justify-end pt-4 space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Bill Form */}
      {showEditForm && editBill && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className={`
            relative overflow-hidden rounded-xl shadow-2xl w-full max-w-md
            ${darkMode
              ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 text-white'
              : 'bg-gradient-to-br from-white to-blue-50 border border-blue-100 text-gray-800'
            }
          `}>
            {/* Water bubble effects */}
            <div className="absolute -top-4 -right-4 w-32 h-32 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute top-12 right-12 w-4 h-4 rounded-full bg-blue-400/50 animate-float-bubble" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-16 right-8 w-3 h-3 rounded-full bg-cyan-400/50 animate-float-bubble" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute top-8 right-16 w-2 h-2 rounded-full bg-blue-300/50 animate-float-bubble" style={{ animationDelay: '2.5s' }}></div>
            </div>

            {/* Gradient header */}
            <div className={`
              p-6 pb-4 border-b
              ${darkMode
                ? 'border-gray-700 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800'
                : 'border-blue-100 bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-100'
              }
            `}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`
                    p-2 rounded-lg mr-3
                    ${darkMode
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                      : 'bg-gradient-to-br from-blue-400 to-cyan-500'
                    }
                  `}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                  </div>
                  <h2 className={`
                    text-xl font-bold bg-clip-text text-transparent animate-gradient-shift
                    ${darkMode
                      ? 'bg-gradient-to-r from-blue-300 via-cyan-400 to-blue-300'
                      : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600'
                    }
                  `}>Edit Water Bill</h2>
                </div>
                <button
                  className={`
                    rounded-full p-1 transition-colors
                    ${darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-blue-100'
                    }
                  `}
                  onClick={() => {
                    setShowEditForm(false);
                    setEditBill(null);
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleEditBill} className="p-6">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className={`
                    flex items-center text-sm font-bold mb-2
                    ${darkMode ? 'text-blue-300' : 'text-blue-600'}
                  `} htmlFor="edit_month">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                    Billing Month
                  </label>
                  <input
                    type="month"
                    id="edit_month"
                    name="month"
                    className={`
                      w-full px-3 py-2 rounded-lg transition-all duration-200
                      ${darkMode
                        ? 'bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        : 'bg-white border border-blue-200 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      }
                    `}
                    value={formData.month}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className={`
                    flex items-center text-sm font-bold mb-2
                    ${darkMode ? 'text-blue-300' : 'text-blue-600'}
                  `} htmlFor="edit_previous_reading">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    Previous Reading (m³)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="edit_previous_reading"
                      name="previous_reading"
                      step="0.01"
                      min="0"
                      className={`
                        w-full px-3 py-2 rounded-lg transition-all duration-200
                        ${darkMode
                          ? 'bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          : 'bg-white border border-blue-200 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        }
                      `}
                      value={formData.previous_reading}
                      onChange={handleChange}
                      required
                    />
                    <span className={`absolute right-3 top-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>m³</span>
                  </div>
                </div>

                <div>
                  <label className={`
                    flex items-center text-sm font-bold mb-2
                    ${darkMode ? 'text-blue-300' : 'text-blue-600'}
                  `} htmlFor="edit_current_reading">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    Current Reading (m³)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="edit_current_reading"
                      name="current_reading"
                      step="0.01"
                      min="0"
                      className={`
                        w-full px-3 py-2 rounded-lg transition-all duration-200
                        ${darkMode
                          ? 'bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          : 'bg-white border border-blue-200 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        }
                      `}
                      value={formData.current_reading}
                      onChange={handleChange}
                      required
                    />
                    <span className={`absolute right-3 top-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>m³</span>
                  </div>
                </div>

                <div>
                  <label className={`
                    flex items-center text-sm font-bold mb-2
                    ${darkMode ? 'text-blue-300' : 'text-blue-600'}
                  `} htmlFor="edit_consumption">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.24 7.24a1 1 0 011.41 1.41l-5.66 5.66a1 1 0 01-1.41 0l-2.83-2.83a1 1 0 011.41-1.41l2.12 2.12 4.96-4.95z"></path>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"></path>
                    </svg>
                    Consumption (m³)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="edit_consumption"
                      name="consumption"
                      step="0.01"
                      min="0"
                      className={`
                        w-full px-3 py-2 rounded-lg transition-all duration-200
                        ${darkMode
                          ? 'bg-gray-900 border border-gray-700 text-blue-400 font-medium'
                          : 'bg-blue-50 border border-blue-200 text-blue-700 font-medium'
                        }
                      `}
                      value={formatNumber(Math.max(0, parseFloat(formData.current_reading || '0') - parseFloat(formData.previous_reading || '0')))}
                      readOnly
                    />
                    <span className={`absolute right-3 top-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>m³</span>
                  </div>
                </div>

                <div>
                  <label className={`
                    flex items-center text-sm font-bold mb-2
                    ${darkMode ? 'text-blue-300' : 'text-blue-600'}
                  `} htmlFor="edit_rate">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h5.586a1 1 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                    </svg>
                    Rate per Cubic Meter
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="edit_rate"
                      name="rate"
                      step="0.01"
                      min="0"
                      className={`
                        w-full px-3 py-2 rounded-lg transition-all duration-200
                        ${darkMode
                          ? 'bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          : 'bg-white border border-blue-200 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        }
                      `}
                      value={formData.rate}
                      onChange={handleChange}
                      required
                    />
                    <span className={`absolute right-3 top-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>₱/m³</span>
                  </div>
                </div>

                <div>
                  <label className={`
                    flex items-center text-sm font-bold mb-2
                    ${darkMode ? 'text-blue-300' : 'text-blue-600'}
                  `} htmlFor="edit_amount">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
                    </svg>
                    Total Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="edit_amount"
                      name="amount"
                      step="0.01"
                      min="0"
                      className={`
                        w-full px-3 py-2 rounded-lg transition-all duration-200 font-bold
                        ${darkMode
                          ? 'bg-gray-900 border border-gray-700 text-red-400'
                          : 'bg-blue-50 border border-blue-200 text-red-600'
                        }
                      `}
                      value={formData.amount ? formatNumber(parseFloat(formData.amount)) : ''}
                      readOnly
                    />
                    <span className={`absolute right-3 top-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>₱</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8 space-x-3">
                <button
                  type="button"
                  className={`
                    relative overflow-hidden group rounded-lg font-bold py-2 px-4
                    transition-all duration-200 transform hover:scale-105
                    ${darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }
                  `}
                  onClick={() => {
                    setShowEditForm(false);
                    setEditBill(null);
                  }}
                >
                  <span className="relative z-10">Cancel</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white"></div>
                </button>
                <button
                  type="submit"
                  className={`
                    relative overflow-hidden group rounded-lg font-bold py-2 px-4
                    transition-all duration-300 transform hover:scale-105 animate-gradient-shift
                    ${darkMode
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                    }
                  `}
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Update Bill
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white"></div>
                  <span className="absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 bg-white"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table Heading */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gradient-water' : 'text-gradient-water'}`}>
          Water Bills Records
        </h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          A complete list of all your water bill records with detailed information.
        </p>
      </div>

      {/* Bill Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className={`
            animate-spin rounded-full h-16 w-16 border-4
            ${darkMode
              ? 'border-blue-500 border-t-transparent'
              : 'border-cyan-500 border-t-transparent'
            }
          `}></div>
        </div>
      ) : filteredBills.length > 0 ? (
        <div className="relative mb-8">
          {/* Water border effect container */}
          <div className={`
            absolute -inset-1 rounded-xl opacity-70 blur-sm
            ${darkMode
              ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-pulse-slow'
              : 'bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 animate-pulse-slow'
            }
          `}></div>

          {/* Water droplet/bubble effects */}
          <div className="absolute -top-4 -left-4 w-32 h-32 opacity-70 pointer-events-none overflow-hidden">
            {/* Multiple bubbles with different sizes and animation delays */}
            <div className="absolute top-12 left-12 w-4 h-4 rounded-full bg-blue-400/50 animate-float-bubble" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-16 left-8 w-3 h-3 rounded-full bg-cyan-400/50 animate-float-bubble" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-8 left-16 w-2 h-2 rounded-full bg-blue-300/50 animate-float-bubble" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="absolute -top-4 -right-4 w-32 h-32 opacity-70 pointer-events-none overflow-hidden">
            <div className="absolute top-12 right-12 w-4 h-4 rounded-full bg-blue-400/50 animate-float-bubble" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-16 right-8 w-3 h-3 rounded-full bg-cyan-400/50 animate-float-bubble" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-8 right-16 w-2 h-2 rounded-full bg-blue-300/50 animate-float-bubble" style={{ animationDelay: '2.5s' }}></div>
          </div>

          <div className="absolute -bottom-4 -left-4 w-32 h-32 opacity-70 pointer-events-none overflow-hidden">
            <div className="absolute bottom-12 left-12 w-4 h-4 rounded-full bg-blue-400/50 animate-float-bubble" style={{ animationDelay: '0.7s' }}></div>
            <div className="absolute bottom-16 left-8 w-3 h-3 rounded-full bg-cyan-400/50 animate-float-bubble" style={{ animationDelay: '1.7s' }}></div>
            <div className="absolute bottom-8 left-16 w-2 h-2 rounded-full bg-blue-300/50 animate-float-bubble" style={{ animationDelay: '2.7s' }}></div>
          </div>

          <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-70 pointer-events-none overflow-hidden">
            <div className="absolute bottom-12 right-12 w-4 h-4 rounded-full bg-blue-400/50 animate-float-bubble" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute bottom-16 right-8 w-3 h-3 rounded-full bg-cyan-400/50 animate-float-bubble" style={{ animationDelay: '1.3s' }}></div>
            <div className="absolute bottom-8 right-16 w-2 h-2 rounded-full bg-blue-300/50 animate-float-bubble" style={{ animationDelay: '2.3s' }}></div>
          </div>

          {/* Water ripple effects */}
          <div className="absolute top-1/4 left-0 w-4 h-4">
            <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ripple" style={{ animationDelay: '0s' }}></div>
          </div>

          <div className="absolute top-3/4 right-0 w-4 h-4">
            <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ripple" style={{ animationDelay: '1.5s' }}></div>
          </div>

          {/* Main table container */}
          <div className={`
            rounded-xl shadow-lg overflow-hidden animate-fade-in relative z-10
            ${darkMode
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
              : 'bg-gradient-to-br from-white to-blue-50 border border-blue-100'
            }
          `}>
            {/* Water glow effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
              <div className={`
                absolute inset-0 opacity-30
                ${darkMode
                  ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-gradient-shift'
                  : 'bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 animate-gradient-shift'
                }
              `}></div>
            </div>

            {/* Water wave animation effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
              <div className={`
                h-4 animate-wave
                ${darkMode
                  ? 'bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20'
                  : 'bg-gradient-to-r from-blue-400/20 via-cyan-300/20 to-blue-400/20'
                }
              `}></div>
            </div>

            <div className="overflow-hidden">
            <table className="w-full">
              <thead className={`
                animate-gradient-shift
                ${darkMode
                  ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 shadow-inner'
                  : 'bg-gradient-to-r from-blue-200 via-cyan-100 to-blue-200 shadow-sm'
                }
              `}>
                <tr>
                  <th
                    scope="col"
                    className={`
                      px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer
                      transition-colors duration-200
                      ${darkMode
                        ? 'text-blue-400 hover:bg-gray-800'
                        : 'text-blue-800 hover:bg-blue-100'
                      }
                    `}
                    onClick={() => handleSort('month')}
                  >
                    <div className="flex items-center">
                      <span>Month</span>
                      {sortField === 'month' && (
                        <span className={`
                          ml-1 transition-transform duration-200
                          ${sortDirection === 'asc' ? 'transform rotate-0' : 'transform rotate-180'}
                        `}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className={`
                      px-6 py-4 text-left text-xs font-bold uppercase tracking-wider
                      ${darkMode ? 'text-blue-400' : 'text-blue-800'}
                    `}
                  >
                    Previous Reading
                  </th>
                  <th
                    scope="col"
                    className={`
                      px-6 py-4 text-left text-xs font-bold uppercase tracking-wider
                      ${darkMode ? 'text-blue-400' : 'text-blue-800'}
                    `}
                  >
                    Current Reading
                  </th>
                  <th
                    scope="col"
                    className={`
                      px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer
                      transition-colors duration-200
                      ${darkMode
                        ? 'text-blue-400 hover:bg-gray-800'
                        : 'text-blue-800 hover:bg-blue-100'
                      }
                    `}
                    onClick={() => handleSort('consumption')}
                  >
                    <div className="flex items-center">
                      <span>Consumption (m³)</span>
                      {sortField === 'consumption' && (
                        <span className={`
                          ml-1 transition-transform duration-200
                          ${sortDirection === 'asc' ? 'transform rotate-0' : 'transform rotate-180'}
                        `}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className={`
                      px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer
                      transition-colors duration-200
                      ${darkMode
                        ? 'text-blue-400 hover:bg-gray-800'
                        : 'text-blue-800 hover:bg-blue-100'
                      }
                    `}
                    onClick={() => handleSort('rate')}
                  >
                    <div className="flex items-center">
                      <span>Rate per m³</span>
                      {sortField === 'rate' && (
                        <span className={`
                          ml-1 transition-transform duration-200
                          ${sortDirection === 'asc' ? 'transform rotate-0' : 'transform rotate-180'}
                        `}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className={`
                      px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer
                      transition-colors duration-200
                      ${darkMode
                        ? 'text-blue-400 hover:bg-gray-800'
                        : 'text-blue-800 hover:bg-blue-100'
                      }
                    `}
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center">
                      <span>Amount</span>
                      {sortField === 'amount' && (
                        <span className={`
                          ml-1 transition-transform duration-200
                          ${sortDirection === 'asc' ? 'transform rotate-0' : 'transform rotate-180'}
                        `}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className={`
                      px-6 py-4 text-center text-xs font-bold uppercase tracking-wider
                      ${darkMode ? 'text-blue-400' : 'text-blue-800'}
                    `}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`
                divide-y
                ${darkMode
                  ? 'divide-gray-700'
                  : 'divide-blue-100'
                }
              `}>
                {filteredBills.map((bill, index) => (
                  <tr
                    key={bill.id}
                    className={`
                      group transition-all duration-300 hover:shadow-lg
                      ${darkMode
                        ? 'hover:bg-gradient-to-r from-gray-800 via-gray-800/80 to-gray-800'
                        : 'hover:bg-gradient-to-r from-blue-50 via-blue-50/80 to-blue-50'
                      }
                      ${index % 2 === 0
                        ? darkMode ? 'bg-gray-800/50' : 'bg-blue-50/50'
                        : ''
                      }
                      hover:scale-[1.01] transform
                    `}

                  >
                    <td className={`
                      px-6 py-4 whitespace-nowrap text-sm font-medium
                      ${darkMode ? 'text-white' : 'text-gray-900'}
                    `}>
                      <div className="flex items-center">
                        <span className="animate-gradient-shift bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
                          {formatMonth(bill.month)}
                        </span>
                      </div>
                    </td>
                    <td className={`
                      px-6 py-4 whitespace-nowrap text-sm
                      ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                    `}>
                      {formatNumber(bill.previous_reading)}
                    </td>
                    <td className={`
                      px-6 py-4 whitespace-nowrap text-sm
                      ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                    `}>
                      {formatNumber(bill.current_reading)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span className={`
                          font-semibold
                          ${bill.consumption > 100
                            ? darkMode ? 'text-orange-400' : 'text-orange-500'
                            : darkMode ? 'text-green-400' : 'text-green-500'
                          }
                          group-hover:animate-pulse-slow
                        `}>
                          {formatNumber(bill.consumption)}
                        </span>
                        <svg className="w-4 h-4 ml-1 text-blue-500 group-hover:animate-bounce-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                        </svg>
                      </div>
                    </td>
                    <td className={`
                      px-6 py-4 whitespace-nowrap text-sm
                      ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                    `}>
                      ₱{formatNumber(bill.rate)}
                    </td>
                    <td className={`
                      px-6 py-4 whitespace-nowrap text-sm font-bold
                      ${darkMode ? 'text-red-400' : 'text-red-600'}
                    `}>
                      <div className="group-hover:animate-pulse-slow">
                        ₱{formatNumber(bill.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                      <button
                        className={`
                          py-1.5 px-3 rounded-lg font-medium transition-all duration-300
                          transform hover:scale-105 inline-flex items-center shadow-md
                          relative overflow-hidden group
                          ${darkMode
                            ? 'bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 text-white hover:shadow-blue-500/30 hover:shadow-lg'
                            : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 text-white hover:shadow-blue-500/30 hover:shadow-lg'
                          }
                        `}
                        onClick={() => startEditBill(bill)}
                      >
                        <svg className="w-3.5 h-3.5 mr-1 group-hover:animate-bounce-subtle" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                        <span className="relative z-10">Edit</span>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white"></div>
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      </button>
                      <button
                        className={`
                          py-1.5 px-3 rounded-lg font-medium transition-all duration-200
                          transform hover:scale-105 inline-flex items-center
                          ${darkMode
                            ? 'bg-gradient-to-r from-red-700 to-red-800 text-white hover:from-red-600 hover:to-red-700'
                            : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
                          }
                        `}
                        onClick={() => handleDeleteBill(bill.id)}
                      >
                        <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      ) : (
        <div className={`
          rounded-xl shadow-lg p-8 text-center animate-fade-in
          ${darkMode
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
            : 'bg-gradient-to-br from-white to-blue-50 border border-blue-100'
          }
        `}>
          <div className="mb-6 flex justify-center">
            <div className={`
              p-4 rounded-full
              ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}
            `}>
              <svg className="w-16 h-16 animate-pulse-slow text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          <p className={`
            text-lg mb-6
            ${darkMode ? 'text-gray-300' : 'text-gray-600'}
          `}>
            No water bills found.
          </p>
          <button
            className={`
              relative overflow-hidden group rounded-lg font-bold py-3 px-6
              flex items-center justify-center mx-auto
              transition-all duration-300 transform hover:scale-105 animate-gradient-shift
              ${darkMode
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
              }
            `}
            onClick={() => setShowAddForm(true)}
          >
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-2 group-hover:animate-bounce-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Add Your First Water Bill</span>
            </span>
            <span className="absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 bg-white"></span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white"></div>
          </button>
        </div>
      )}
    </div>
  );
}
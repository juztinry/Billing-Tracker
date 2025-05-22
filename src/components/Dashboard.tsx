'use client';

import { useAuth } from '@/utils/AuthContext';
import { useTheme } from '@/utils/ThemeContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Tables } from '@/types/supabase';

type WaterBill = Tables<'water_bills'>;
type ElectricityBill = Tables<'electricity_bills'>;

export default function Dashboard() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [waterBills, setWaterBills] = useState<WaterBill[]>([]);
  const [electricityBills, setElectricityBills] = useState<ElectricityBill[]>([]);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    if (user) {
      fetchWaterBills();
      fetchElectricityBills();
    }
  }, [user]);

  async function fetchWaterBills() {
    try {
      const { data, error } = await supabase
        .from('water_bills')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('month', { ascending: true });

      if (error) throw error;

      setWaterBills(data || []);
    } catch (error) {
      console.error('Error fetching water bills:', error);
    }
  }

  async function fetchElectricityBills() {
    try {
      const { data, error } = await supabase
        .from('electricity_bills')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('month', { ascending: true });

      if (error) throw error;

      setElectricityBills(data || []);
    } catch (error) {
      console.error('Error fetching electricity bills:', error);
    }
  }



  // Group bills by month for chart display
  const getMonthFromYYYYMM = (yyyymm: string) => {
    if (!yyyymm || !yyyymm.includes('-')) return '';
    const monthNum = parseInt(yyyymm.split('-')[1]);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNum - 1];
  };

  // Filter bills for selected year
  const selectedYearElectricityBills = electricityBills.filter(bill =>
    bill.month.startsWith(selectedYear.toString())
  );

  const selectedYearWaterBills = waterBills.filter(bill =>
    bill.month.startsWith(selectedYear.toString())
  );

  // Get max consumption for setting chart height
  const maxElectricityConsumption = Math.max(...selectedYearElectricityBills.map(bill => bill.consumption), 250);
  const maxWaterConsumption = Math.max(...selectedYearWaterBills.map(bill => bill.consumption), 18);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`
        text-3xl font-bold mb-8
        ${darkMode
          ? 'text-gradient-primary text-glow-primary'
          : 'text-gradient-primary'
        }
      `}>
        Your Billing Dashboard
      </h1>

      {/* Consumption Charts */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6 border-b pb-2
          ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
          <h2 className={`
            text-2xl font-bold
            ${darkMode
              ? 'text-gradient-primary text-shadow-effect'
              : 'text-gradient-primary'
            }
          `}>
            {selectedYear} Monthly Bills Consumption
          </h2>

          {/* Year Selector */}
          <div className="flex items-center">
            <label className={`mr-2 font-medium ${darkMode ? 'text-gradient-primary text-glow-primary' : 'text-gradient-primary'}`}>
              Select Year:
            </label>
            <div className="relative group">
              <div className={`absolute -inset-0.5 rounded-lg opacity-70 blur-sm transition-all duration-300 group-hover:opacity-100
                ${darkMode
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-shift'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-shift'
                }
              `}></div>
              <select
                className={`
                  relative px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                  transition-all duration-300 transform hover:scale-105
                  ${darkMode
                    ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700 text-white'
                    : 'bg-gradient-to-r from-white via-purple-50 to-white border border-gray-300 text-gray-800'}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Electricity Consumption Chart */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-2xl border border-amber-900/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-yellow-600/5 opacity-30"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-yellow-500/5 to-amber-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent drop-shadow-lg">
                  Electricity Bills Consumption
                </h3>
                <span className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                  Consumption data available
                </span>
              </div>

              <div className="h-72 flex items-end justify-between mx-2 mt-8 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="w-full h-px bg-gray-700/50 backdrop-blur-sm"></div>
                  ))}
                </div>

                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => {
                  const bill = selectedYearElectricityBills.find((b: ElectricityBill) => getMonthFromYYYYMM(b.month) === month);
                  const consumption = bill ? bill.consumption : 0;
                  const barHeight = bill ? (consumption / maxElectricityConsumption) * 100 : 0;

                  return (
                    <div key={month} className="flex flex-col items-center w-full group/bar">
                      {/* Consumption, Amount and Rate tooltip */}
                      {bill && (
                        <div className="absolute -top-20 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300 bg-amber-800/90 text-amber-100 text-xs px-3 py-2 rounded-md shadow-lg z-20 w-36">
                          <div className="flex flex-col gap-1">
                            <div>
                              <span>Consumption: {consumption} kWh</span>
                            </div>
                            <div>
                              <span>Amount: ₱{bill.amount ? Math.round(bill.amount) : '0'}</span>
                            </div>
                            <div>
                              <span>Rate: ₱{bill.rate ? Math.round(bill.rate) : '0'}/kWh</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="relative w-7 md:w-10 bg-gray-800/80 rounded-t-lg overflow-hidden shadow-inner" style={{ height: '220px' }}>
                        {/* Bar background glow effect */}
                        {bill && (
                          <div className="absolute inset-0 bg-amber-500/20 animate-pulse-slow"></div>
                        )}

                        {/* The actual bar */}
                        <div
                          className={`absolute bottom-0 w-full transition-all duration-700 ease-out ${
                            bill
                              ? 'bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400 group-hover/bar:from-amber-500 group-hover/bar:to-yellow-300'
                              : 'bg-gray-700/50'
                          }`}
                          style={{ height: `${barHeight}%` }}
                        >
                          {/* Top highlight */}
                          {bill && barHeight > 5 && (
                            <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-300/80 blur-sm"></div>
                          )}
                        </div>
                      </div>

                      <div className="text-amber-100/80 font-medium text-xs mt-2 group-hover/bar:text-amber-300 transition-colors">{month}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-amber-400/70 text-xs mt-4">
                <div className="rotate-90 origin-left translate-y-6 -translate-x-2 font-medium">Consumption (kWh)</div>
                <div className="text-right text-amber-400/70 text-xs italic">Hover over bars for details</div>
              </div>

              {/* Summary Section */}
              <div className="mt-6 pt-4 border-t border-amber-900/30">
                <h4 className="text-amber-300 font-bold mb-2">Annual Summary</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-amber-900/30 rounded-lg p-3">
                    <div className="text-amber-400/70 text-xs mb-1">Total Consumption</div>
                    <div className="text-amber-200 font-bold">
                      {Math.round(selectedYearElectricityBills.reduce((sum: number, bill: ElectricityBill) => sum + bill.consumption, 0))} kWh
                    </div>
                  </div>
                  <div className="bg-amber-900/30 rounded-lg p-3">
                    <div className="text-amber-400/70 text-xs mb-1">Avg. Rate</div>
                    <div className="text-amber-200 font-bold">
                      ₱{selectedYearElectricityBills.length > 0
                        ? Math.round(selectedYearElectricityBills.reduce((sum: number, bill: ElectricityBill) => sum + (bill.rate || 0), 0) /
                          (selectedYearElectricityBills.filter((bill: ElectricityBill) => bill.rate).length || 1))
                        : '0'}/kWh
                    </div>
                  </div>
                  <div className="bg-amber-900/30 rounded-lg p-3">
                    <div className="text-amber-400/70 text-xs mb-1">Total Amount</div>
                    <div className="text-amber-200 font-bold">
                      ₱{Math.round(selectedYearElectricityBills.reduce((sum: number, bill: ElectricityBill) => sum + (bill.amount || 0), 0))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Water Consumption Chart */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-2xl border border-blue-900/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/5 opacity-30"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/5 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
                  Water Bills Consumption
                </h3>
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                  Consumption data available
                </span>
              </div>

              <div className="h-72 flex items-end justify-between mx-2 mt-8 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="w-full h-px bg-gray-700/50 backdrop-blur-sm"></div>
                  ))}
                </div>

                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => {
                  const bill = selectedYearWaterBills.find((b: WaterBill) => getMonthFromYYYYMM(b.month) === month);
                  const consumption = bill ? bill.consumption : 0;
                  const barHeight = bill ? (consumption / maxWaterConsumption) * 100 : 0;

                  return (
                    <div key={month} className="flex flex-col items-center w-full group/bar">
                      {/* Consumption, Amount and Rate tooltip */}
                      {bill && (
                        <div className="absolute -top-20 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300 bg-blue-800/90 text-blue-100 text-xs px-3 py-2 rounded-md shadow-lg z-20 w-36">
                          <div className="flex flex-col gap-1">
                            <div>
                              <span>Consumption: {consumption} m³</span>
                            </div>
                            <div>
                              <span>Amount: ₱{bill.amount ? Math.round(bill.amount) : '0'}</span>
                            </div>
                            <div>
                              <span>Rate: ₱{bill.rate ? Math.round(bill.rate) : '0'}/m³</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="relative w-7 md:w-10 bg-gray-800/80 rounded-t-lg overflow-hidden shadow-inner" style={{ height: '220px' }}>
                        {/* Water ripple effect */}
                        {bill && (
                          <div className="absolute inset-0 bg-blue-500/20 animate-pulse-slow"></div>
                        )}

                        {/* The actual bar */}
                        <div
                          className={`absolute bottom-0 w-full transition-all duration-700 ease-out ${
                            bill
                              ? 'bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400 group-hover/bar:from-blue-500 group-hover/bar:to-cyan-300'
                              : 'bg-gray-700/50'
                          }`}
                          style={{ height: `${barHeight}%` }}
                        >
                          {/* Water surface effect */}
                          {bill && barHeight > 5 && (
                            <>
                              <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-300/80 blur-sm"></div>
                              <div className="absolute top-0 left-0 right-0 h-3 bg-blue-400/20"></div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-blue-100/80 font-medium text-xs mt-2 group-hover/bar:text-blue-300 transition-colors">{month}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-blue-400/70 text-xs mt-4">
                <div className="rotate-90 origin-left translate-y-6 -translate-x-2 font-medium">Consumption (m³)</div>
                <div className="text-right text-blue-400/70 text-xs italic">Hover over bars for details</div>
              </div>

              {/* Summary Section */}
              <div className="mt-6 pt-4 border-t border-blue-900/30">
                <h4 className="text-blue-300 font-bold mb-2">Annual Summary</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-900/30 rounded-lg p-3">
                    <div className="text-blue-400/70 text-xs mb-1">Total Consumption</div>
                    <div className="text-blue-200 font-bold">
                      {Math.round(selectedYearWaterBills.reduce((sum: number, bill: WaterBill) => sum + bill.consumption, 0))} m³
                    </div>
                  </div>
                  <div className="bg-blue-900/30 rounded-lg p-3">
                    <div className="text-blue-400/70 text-xs mb-1">Avg. Rate</div>
                    <div className="text-blue-200 font-bold">
                      ₱{selectedYearWaterBills.length > 0
                        ? Math.round(selectedYearWaterBills.reduce((sum: number, bill: WaterBill) => sum + (bill.rate || 0), 0) /
                          (selectedYearWaterBills.filter((bill: WaterBill) => bill.rate).length || 1))
                        : '0'}/m³
                    </div>
                  </div>
                  <div className="bg-blue-900/30 rounded-lg p-3">
                    <div className="text-blue-400/70 text-xs mb-1">Total Amount</div>
                    <div className="text-blue-200 font-bold">
                      ₱{Math.round(selectedYearWaterBills.reduce((sum: number, bill: WaterBill) => sum + (bill.amount || 0), 0))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
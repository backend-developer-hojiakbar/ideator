import React from 'react';
import type { FinancialProjections } from '../types';

interface FinancialCalculatorProps {
  projections: FinancialProjections;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({ projections }) => {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg animate-fade-in">
      <h3 className="text-xl font-bold text-cyan-500 dark:text-cyan-400 mb-4">Moliyaviy Prognozlar</h3>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Daromadlar Prognozi (3 yil)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Yil</th>
                <th scope="col" className="px-6 py-3">Prognoz qilingan daromad</th>
              </tr>
            </thead>
            <tbody>
              {projections.revenueForecast.map(forecast => (
                <tr key={forecast.year} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {forecast.year}-yil
                  </th>
                  <td className="px-6 py-4">
                    {formatCurrency(forecast.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Zararsizlik Nuqtasi Tahlili</h4>
        <p className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">{projections.breakEvenAnalysis}</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Asosiy Taxminlar</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
          {projections.keyAssumptions.map((assumption, index) => (
            <li key={index}>{assumption}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

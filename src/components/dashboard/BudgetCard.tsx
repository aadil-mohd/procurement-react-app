import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

interface BudgetCardProps {
  heading?:string;
  width?: number;
  height?: number;
  budgetDetails?: any;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ width = 456, height = 244, budgetDetails,heading= "Yearly Spend" }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  const showChart = (details?: any) => {
    try {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
        chartInstanceRef.current = new ChartJS(ctx, {
          type: 'line',
          data: {
            labels: details?.years || ['2020', '2021', '2022', '2023', '2024'],
            datasets: [
              {
                label: 'Estimated Budget',
                data: details?.budgets || [12000, 15000, 18000, 22000, 25000],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
              },
              {
                label: 'Actual Spend',
                data: details?.spend || [10000, 13000, 16000, 19000, 21000],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: 'index',
            },
            plugins: {
              tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                  }
                }
              },
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#6B7280',
                  font: {
                    size: 12,
                    weight: 'normal',
                  },
                },
                border: {
                  display: false,
                },
              },
              y: {
                grid: {
                  color: '#F3F4F6',
                },
                ticks: {
                  color: '#6B7280',
                  font: {
                    size: 12,
                    weight: 'normal',
                  },
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                },
                beginAtZero: true,
                border: {
                  display: false,
                },
              },
            },
            elements: {
              point: {
                hoverBackgroundColor: '#ffffff',
              },
            },
            animation: {
              duration: 2000,
              easing: 'easeInOutQuart',
            },
          },
        });
      }
    }
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  };

  useEffect(() => {
    showChart(budgetDetails);
  }, [budgetDetails]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[320px] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-lg font-semibold">📊</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{heading}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Estimated Budget</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Actual Spend</span>
          </div>
        </div>
      </div>
      <div className="relative h-[220px] overflow-hidden rounded-lg">
        <canvas
          ref={chartRef}
          className="w-full h-full drop-shadow-sm"
          width={width}
          height={height}
        />
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-green-50/30 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default BudgetCard;

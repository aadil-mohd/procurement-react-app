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
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
        chartInstanceRef.current = new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: details?.years || ['2000', '2001', '2002', '2003', '2004'],
            datasets: [
              {
                label: 'Budget',
                data: details?.budgets || [0, 0, 0, 0, 0],
                backgroundColor: '#1A73E8',
                borderRadius: 4,
                barThickness: 16,
                borderWidth: 2,
                borderColor: 'rgba(0,0,0,0)',
              },
              {
                label: 'Spend',
                data: details?.spend || [0, 0, 0, 0, 0],
                backgroundColor: '#00C3D1',
                borderRadius: 4,
                barThickness: 16,
                borderWidth: 2,
                borderColor: 'rgba(0,0,0,0)',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false, // Ensure the chart's aspect ratio can change based on container size
            plugins: {
              tooltip: { enabled: true },
              legend: {
                display: false,
                position: 'top',
                align: 'end',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  boxWidth: 10,
                  font: {
                    size: 8,
                  },
                  padding: 5,
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                title: {
                  display: false,
                  text: 'Year',
                  font: {
                    size: 10,
                  },
                },
              },
              y: {
                grid: {
                  color: '#ECECEC',
                },
                title: {
                  display: true,
                  font: {
                    size: 10,
                  },
                },
                beginAtZero: true,
                ticks: {
                  stepSize: 500,
                },
              },
            },
          },
        });
      }
    }
  };

  useEffect(() => {
    showChart(budgetDetails);
  }, [budgetDetails]);

  return (
    <div
      className={`p-4 bg-white rounded-lg w-full  desktop:min-width:${width} desktop:max-width:${width}`}
      style={{ border: '2px solid #E5E6EC', height }}
    >
      <div className="flex justify-between mt-[.5rem] mb-[.9375rem]">
        <h2 className="text-lg font-semibold text-gray-600">{heading}</h2>
        <div className="flex text-sm">
          <span className="flex items-center mr-2">
            <div className="p-1.5 bg-[#1A73E8] rounded-full mr-[4px]"></div> Estimated
          </span>
          <span className="flex items-center">
            <div className="p-1.5 bg-[#00C3D1] rounded-full mr-[4px]"></div> Spend Amount
          </span>
        </div>
      </div>
      <div className="relative" style={{ height: 'calc(100% - 60px)' }}>
        <canvas
          ref={chartRef}
          style={{ width: '100%', height: '100%' }}
          width={width} // Dynamically set width and height
          height={height} // Adjust for title and margin space
        />
      </div>
    </div>
  );
};

export default BudgetCard;

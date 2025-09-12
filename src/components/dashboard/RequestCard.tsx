import React, { useRef, useEffect} from 'react';
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

interface RequestCardProps {
  labels: string[];
  data: number[];
  colors: string[];
}

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend, Title);

const RequestCard: React.FC<RequestCardProps> = ({ labels, data, colors }: RequestCardProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    try {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new ChartJS(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Request Status',
                data: data,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 8,
                spacing: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 2000,
              easing: 'easeInOutQuart',
            },
            plugins: {
              legend: {
                display: false,
              },
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
                    const total = data.reduce((a, b) => a + b, 0);
                    const percentage = ((context.parsed * 100) / total).toFixed(1);
                    return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                  }
                }
              },
            },
            cutout: '65%',
            rotation: -90,
            circumference: 360,
            elements: {
              arc: {
                borderWidth: 0,
              },
            },
          },
          plugins: [
            {
              id: 'center-text',
              beforeDraw(chart) {
                const { ctx, chartArea } = chart;

                // Calculate the center of the doughnut
                const centerX = (chartArea.left + chartArea.right) / 2;
                const centerY = (chartArea.top + chartArea.bottom) / 2;

                // Calculate total from dataset
                const total = data.reduce((sum, value) => sum + value, 0);

                // Save canvas state
                ctx.save();

                // Draw 'Total' text (normal)
                ctx.font = '14px Inter, system-ui, sans-serif';
                ctx.fillStyle = '#6B7280';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Total', centerX, centerY - 8);

                // Draw the total value (bold)
                ctx.font = 'bold 24px Inter, system-ui, sans-serif';
                ctx.fillStyle = '#1F2937';
                ctx.fillText(`${total}`, centerX, centerY + 12);

                // Restore canvas state
                ctx.restore();
              },
            },
          ],
        });
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
    } catch (error) {
      console.error('Error creating donut chart:', error);
    }
  }, [labels, data, colors]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[320px]">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white text-lg font-semibold">📈</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Request Status</h2>
      </div>
      
      <div className="flex items-center justify-between h-[220px]">
        {/* Chart */}
        <div className="relative flex-1 flex justify-center items-center">
          <div className="relative">
            <canvas ref={chartRef} className="w-[160px] h-[160px] drop-shadow-sm" />
            {/* Chart glow effect */}
            <div className="absolute inset-0 w-[160px] h-[160px] rounded-full bg-gradient-to-r from-blue-100 to-green-100 opacity-20 blur-xl"></div>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="flex-1 space-y-4">
          {labels.map((label, index) => {
            const total = data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((data[index] * 100) / total).toFixed(1) : 0;
            return (
              <div key={index} className="group">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    {/* Color Indicator with animation */}
                    <div className="relative">
                      <div
                        className="w-5 h-5 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: colors[index] }}
                      ></div>
                      <div
                        className="absolute inset-0 w-5 h-5 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-200"
                        style={{ backgroundColor: colors[index] }}
                      ></div>
                    </div>

                    {/* Label and Value */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-800">{label}</span>
                        <span className="text-xs text-gray-500">({percentage}%)</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{`${data[index]?.toLocaleString()}` || "0"}</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: colors[index]
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;

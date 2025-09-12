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
    <div className="bg-white rounded-2xl shadow-lg border-0 p-6 h-[350px] flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-green-50 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">📈</span>
          </div>
                            <div>
                                <h2 className="text-heading-3">Request Status</h2>
                                <p className="text-body-small text-muted">Distribution overview</p>
                            </div>
        </div>
      
        {/* Content - Vertical Layout for Narrow Width */}
        <div className="flex-1 flex flex-col items-center space-y-6">
          {/* Chart Section */}
          <div className="flex-shrink-0">
            <div className="relative">
              <canvas ref={chartRef} className="w-[140px] h-[140px] drop-shadow-lg" width={140} height={140} />
              {/* Chart glow effect */}
              <div className="absolute inset-0 w-[140px] h-[140px] rounded-full bg-gradient-to-r from-emerald-100 to-green-100 opacity-40 blur-xl"></div>
            </div>
          </div>

          {/* Legend Section */}
          <div className="w-full space-y-3">
          {labels.map((label, index) => {
            const total = data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((data[index] * 100) / total).toFixed(1) : 0;
            return (
              <div key={index} className="group">
                <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-100 hover:from-slate-100 hover:to-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {/* Color Indicator */}
                      <div className="relative">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300"
                          style={{ backgroundColor: colors[index] }}
                        ></div>
                        <div
                          className="absolute inset-0 w-4 h-4 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                          style={{ backgroundColor: colors[index] }}
                        ></div>
                      </div>

                      {/* Label */}
                                                    <span className="text-label">{label}</span>
                    </div>
                    
                    {/* Value */}
                    <div className="text-right">
                      <div className="text-base font-bold text-slate-900">{`${data[index]?.toLocaleString()}` || "0"}</div>
                      <div className="text-body-small text-muted">{percentage}%</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
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
    </div>
  );
};

export default RequestCard;

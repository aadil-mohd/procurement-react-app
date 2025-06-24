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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation:{
              duration:0
            },
            plugins: {
              legend: {
                display: false, // Disable Chart.js legend
              },
              tooltip: {
                enabled: false, // Disable Chart.js tooltip
              },
            },
            cutout: '70%',
            rotation: 0,
            circumference: 360,
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
                ctx.font = '18px Arial'; // Normal text style
                ctx.fillStyle = '#333'; // Dark gray color
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Total', centerX, centerY - 10); // Positioned slightly above the center

                // Draw the total value (bold)
                ctx.font = 'bold 20px Arial'; // Bold and larger text style
                ctx.fillStyle = '#000'; // Black color for emphasis
                ctx.fillText(`${total}`, centerX, centerY + 15); // Positioned slightly below the center

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
  }, [labels, data, colors]);

  return (
    <div
      className="p-4 bg-white rounded-lg w-full desktop:max-w-[32rem] desktop:min-w-[25rem] h-[15.25rem]"
      style={{ border: '2px solid #E5E6EC' }}
    >
      <h2 className="text-lg font-semibold text-gray-600 mt-2 mb-2">Request Status</h2>
      <div className="w-full flex items-center justify-between px-[50px]">
        {/* Chart */}
        <div className="relative">
          <canvas ref={chartRef} className="w-[8.75rem] h-[9.375rem]" />
        </div>

        {/* Custom Legend */}
        <div className="">
          {labels.map((label, index) => (
            <div key={index} className="flex mb-2">
              {/* Color Indicator */}
              <div
                className="w-[10px] h-[10px] mt-2 rounded-full"
                style={{ backgroundColor: colors[index] }}
              ></div>

              {/* Label and Value */}
              <div className="ml-2 text-gray-800">
                <span className='text-xs'>{label}</span>
                <span className="block text-md font-semibold">{`${data[index]?.toLocaleString()}` || ""}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;

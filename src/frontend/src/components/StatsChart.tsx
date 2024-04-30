import { useMemo } from "react";
import { useStats, Stat } from "../providers/stats.provider.tsx";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart - Multi Axis',
      },
    },
    scales: {
        y: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            min: -10,
            max: 60
        },
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            min: 20,
            max: 100,
        },
    },
};

const StatsChart = () => {
    const { stats } = useStats()

    const data = useMemo( () => {
        return {
            labels: stats.map( s => new Date(s.createdAt).toLocaleTimeString() ),
            datasets: [{
                label: `Temperature`,
                data: stats.map( s => s.temperature ),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'y',
                tension: 0.5,

            },{
                label: `Humidity`,
                data: stats.map( s => s.humidity ),
                orderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                yAxisID: 'y1',
                tension: 0.5
            }]
        }
    }, [stats])

    return (
        <Line options={options} data={data} ></Line>
    )
}
export default StatsChart;
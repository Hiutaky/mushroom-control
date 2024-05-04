import { useMemo } from "react";
import { useBackend } from "../providers/backend.provider.tsx";
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
    stacked: true,
    scales: {
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            min: -10,
            max: 100
        },
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            min: 0,
            max: 50,
        },
        y2: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            fill: true,
            min: 0,
            max: 3,
        },
        y3: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            fill: true,
            min: 0,
            max: 4,
        },
    },
};

const StatsChart = () => {
    const { stats } = useBackend()
    const temperatureData = stats.map( s => parseFloat(s.temperature) );
    const humidityData = stats.map( s => parseFloat(s.humidity) );

    const data = useMemo( () => {
        return {
            labels: stats.map( s => new Date(s.createdAt).toLocaleTimeString() ),
            datasets: [{
                label: `Humidity`,
                data: humidityData,
                backgroundColor: 'rgba(53, 162, 235, 1)',
                borderColor: 'rgba(53, 162, 235, 1)',
                yAxisID: 'y',
                tension: 0.5,
                pointStyle: false,
            },{
                label: `Temperature`,
                data: temperatureData,
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderColor: 'rgba(255, 99, 132, 1)',
                yAxisID: 'y1',
                tension: 0.5,
                pointStyle: false,
            },{
                label: `Light`,
                data: stats.map( s => s.light ),
                borderColor: 'green',
                yAxisID: 'y2',
                pointStyle: false,
            },{
                label: `Humidifier`,
                data: stats.map( s => s.humidifier ),
                backgroundColor: 'black',
                borderColor: 'black',
                yAxisID: 'y3',
                pointStyle: false,
            }]
        }
    }, [stats])

    return (
        <Line options={options} data={data} ></Line>
    )
}
export default StatsChart;
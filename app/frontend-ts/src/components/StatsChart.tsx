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
        // hum 
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            min: -10,
            max: 100
        },
        // temp 
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            min: 0,
            max: 50,
            staked: false
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
        //co2
        y4: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            fill: true,
            min: 0,
            max: 2000,
        },
        
    },
};

const StatsChart = () => {
    const { stats : _stats } = useBackend()

    const data = useMemo( () => {
        const stats = _stats.reverse()
        const temperatureData = stats.map( s => s.temperature );
        const temperatureOutData = stats.map( s => s.temperatureOut! );
        const humidityData = stats.map( s => s.humidity );
        const humidityOut = stats.map( s => s.humidityOut! );
        const humidityCo2 = stats.map( s => s.co2Hum );
        const tempCo2 = stats.map( s => s.co2Temp );
        const co2 = stats.map( s => s.co2 );
        return {
            labels: stats.map( s => new Date(s.createdAt).toLocaleTimeString() ),
            datasets: [{
                label: `Humidity In`,
                data: humidityData,
                backgroundColor: '#3b82f6',
                borderColor: '#3b82f6',
                yAxisID: 'y',
                tension: 0.5,
                pointStyle: false,
            },{
                label: `Humidity Out`,
                data: humidityOut,
                backgroundColor: 'rgba(53, 162, 235, 1)',
                borderColor: 'rgba(53, 162, 235, 1)',
                yAxisID: 'y',
                tension: 0.5,
                pointStyle: false,
            },{
                label: `Co2 Humidity`,
                data: humidityCo2,
                backgroundColor: 'rgba(53, 162, 235, 1)',
                borderColor: 'rgba(53, 162, 235, 1)',
                yAxisID: 'y',
                tension: 0.5,
                pointStyle: false,
            },{
                label: `Temperature In`,
                data: temperatureData,
                backgroundColor: '#ef4444',
                borderColor: '#ef4444',
                yAxisID: 'y1',
                tension: 0.5,
                pointStyle: false,
            },{
                label: `Temperature Out`,
                data: temperatureOutData,
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderColor: 'rgba(255, 99, 132, 1)',
                yAxisID: 'y1',
                tension: 0.5,
                pointStyle: false,
            },{
                label: `Co2 Temperature`,
                data: tempCo2,
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderColor: 'rgba(255, 99, 132, 1)',
                yAxisID: 'y1',
                tension: 0.5,
                pointStyle: false,
            },{
                label: `Light`,
                data: stats.map( s => s.led ),
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
            },{
                label: `CO2 PPM`,
                data: co2,
                backgroundColor: 'black',
                borderColor: 'black',
                yAxisID: 'y4',
                pointStyle: false,
            }]
        }
    }, [_stats])

    return (
        //@ts-ignore 
        <Line options={options} data={data} ></Line>
    )
}
export default StatsChart;
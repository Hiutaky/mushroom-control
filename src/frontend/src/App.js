
import StatsChart from './components/StatsChart.tsx';
import Header from './components/Header.jsx';
import './App.css';
import VerticalProgress from './components/VerticalProgress.jsx';
import { useStats } from './providers/stats.provider.tsx';
import Sensor from './components/Sensor.jsx';
import { useMemo } from 'react';
import icons from './icons/icons.js';

function App() {

  const { stats } = useStats()

  const last = stats[stats.length-1]

  return (
    <div className="bg-dark">
      <Header />
      <div className="w-full flex flex-col items-center">
        <div className='container flex flex-col gap-3'>
          <div className='grid grid-cols-[1fr_20%] gap-3'>
            <div className='w-full p-2 border'>
              <StatsChart />
            </div>
            <div className="flex flex-col gap-3 p-3 border">
              <span className=' text-gray-600 font-bold text-sm'>Controllers</span>
              <div className="grid grid-cols-3 gap-2">
                <Sensor 
                  label={'Light'}
                  active={last?.light > 0}
                  icon={icons.Light}
                />
                <Sensor 
                  label={'Fan'}
                  active={last?.humidifier > 0}
                  icon={icons.Fan}
                />
                <Sensor 
                  label={'Mist'}
                  active={last?.humidifier > 0}
                  icon={icons.Humidity}
                />
              </div>
              <div className='w-full border'></div>
              <div className="grid grid-cols-2 gap-2 h-full">
                <VerticalProgress 
                  label='Temp. (C)'
                  color="bg-red-500"
                  unit='°'
                  value={ last?.temperature }
                  min={-5}
                  max={45}
                />
                <VerticalProgress
                  color="bg-blue-500"
                  label='Hum. (%)'
                  min="0"
                  max="100"
                  unit="%"
                  value={ last?.humidity}
                />
              </div>
            </div>
          </div>
          <div className="text-sm px-2 border">
            {
              stats.length ? stats.map( (stat) => 
              <div className='flex flex-row p-2 border-b-2 gap-3'>
                <span>
                  {new Date(stat.createdAt).toLocaleString()}
                </span>
                <span>
                  {parseFloat(stat.temperature).toFixed(2)}°
                </span>
                <span>
                  {parseFloat(stat.humidity).toFixed(2)}%
                </span>
              </div>
              ) : ``
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

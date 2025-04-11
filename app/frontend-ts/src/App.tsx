
import StatsChart from './components/StatsChart.tsx';
import Header from './components/Header';
import VerticalProgress from './components/VerticalProgress';
import { useBackend } from './providers/backend.provider.tsx';
import Sensor from './components/Sensor';
import icons from './icons/icons';
import Webcam from './components/Webcam';
import { useMemo, useState } from 'react';
import Box from './components/Box';
import Footer from './components/Footer';

function App() {
  const { stats, sendAction } = useBackend()
  const [theme, setTheme] = useState('light')
  const last = useMemo( () => stats.at(0)!, [stats]);

  const toggleTheme = () => {
    if( theme === 'light' )
      setTheme('dark')
    else
      setTheme('light')
  }
  
  console.log(last);
  return (
    <div className={`${theme} bg-white dark:bg-slate-950 text-black dark:text-white min-h-[100vh]`}>
      <Header 
        toggleTheme={toggleTheme}
        theme={theme}
      />
      <div className="w-full flex flex-col items-center pb-4">
        <div className='px-2 container flex flex-col gap-3'>
          <div className='grid md:grid-cols-[30%_1fr] lg:grid-cols-[20%_1fr] gap-3'>
            <Box direction='col'>
              <span className='font-bold text-sm'>Controllers</span>
              <div className="grid grid-cols-2 gap-2">
                <Sensor 
                  label={'Light'}
                  active={last.led}
                  icon={icons.Light}
                  onClick={ () => sendAction( last.led ? "OFF_LED" : "ON_LED") }
                />
                <Sensor 
                  label={'IO Fan'}
                  active={ last?.ioFan }
                  onClick={ () => sendAction( last.ioFan ? "OFF_IO_FAN" : "ON_IO_FAN"  )  }
                  icon={icons.Fan}
                />
                <Sensor 
                  label={'Mist Fan'}
                  active={last?.humidifier || last?.fan }
                  onClick={ () => sendAction( last.humidifier && last.fan ? "OFF_FAN" : "ON_FAN"  )  }
                  icon={icons.Fan}
                />
                <Sensor 
                  label={'Mist'}
                  active={last?.humidifier}
                  onClick={ () => sendAction( last.humidifier ? "OFF_HUM" : "ON_HUM" ) }
                  icon={icons.Humidity}
                />
              </div>
              <div className='w-full border border-gray-100'></div>
              <div className="grid grid-cols-2 gap-2 h-full">
                <VerticalProgress 
                  label='Temp. (C)'
                  color="bg-red-500"
                  unit='°'
                  values={ [{
                    color: 'bg-red-500',
                    label: 'In',
                    value: last.temperature
                  }, {
                    color: 'bg-red-300',
                    label: 'Out',
                    value: last.temperatureOut!
                  }] }
                  min={-5}
                  max={45}
                />
                <VerticalProgress
                  color="bg-blue-500"
                  label='Hum. (%)'
                  min={0}
                  max={100}
                  unit="%"
                  values={ [{
                    color: 'bg-blue-500',
                    label: 'In',
                    value: last.humidity
                  }, {
                    color: 'bg-blue-300',
                    label: 'Out',
                    value: last.humidityOut!
                  }] }
                />
              </div>
            </Box>
            <Box>
              <Webcam />
            </Box>
          </div>
          <Box>
            <StatsChart />
          </Box>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;

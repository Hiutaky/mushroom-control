
import StatsChart from './components/StatsChart.tsx';
import Header from './components/Header.jsx';
import VerticalProgress from './components/VerticalProgress.jsx';
import { useBackend } from './providers/backend.provider.tsx';
import Sensor from './components/Sensor.jsx';
import icons from './icons/icons.js';
import Webcam from './components/Webcam.jsx';
import './App.css';
import { useState } from 'react';
import Box from './components/Box.jsx';
import Footer from './components/Footer.jsx';

function App() {
  const { stats, actions } = useBackend()
  const [theme, setTheme] = useState('light')
  const last = stats[0]

  const toggleTheme = () => {
    if( theme === 'light' )
      setTheme('dark')
    else
      setTheme('light')
  }
  

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
              <div className="grid grid-cols-3 gap-2">
                <Sensor 
                  label={'Light'}
                  active={last ? last?.led > 0 : false}
                  icon={icons.Light}
                  onClick={ () => last?.led == 0 ? actions.ON_LED() : actions.OFF_LED()  }
                />
                <Sensor 
                  label={'Fan'}
                  active={last?.ioFan > 0 || last?.ioFan > 0}
                  onClick={ () => last?.ioFan == 0 ? actions.ON_IO_FAN() : actions.OFF_IO_FAN()  }
                  icon={icons.Fan}
                />
                <Sensor 
                  label={'Mist'}
                  active={last?.humidifier > 0}
                  onClick={ () => last?.humidifier == 0 ? actions.ON_HUM() : actions.OFF_HUM()  }
                  icon={icons.Humidity}
                />
              </div>
              <div className='w-full border border-gray-100'></div>
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

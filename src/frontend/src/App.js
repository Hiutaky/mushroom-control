
import StatsChart from './components/StatsChart.tsx';
import Header from './components/Header.jsx';
import './App.css';
import VerticalProgress from './components/VerticalProgress.jsx';
import { useStats } from './providers/stats.provider.tsx';

function App() {

  const { stats } = useStats()
  return (
    <div className="bg-dark">
      <Header />
      <div className="w-full flex flex-col items-center">
        <div className='container'>
          <div className='flex flex-row gap-3'>
            <div className='w-full'>
              <StatsChart />
            </div>
            <VerticalProgress 
              label='Temperature'
              color="bg-red-500"
              value={stats.length ? stats[stats.length-1].temperature : 0}
            />
            <VerticalProgress
              color="bg-blue-500"
              label='Humidity(%)'
              min="0"
              max="100"
              unit="%"
              value={stats.length ? stats[stats.length-1].humidity : 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

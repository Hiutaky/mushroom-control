
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
          <div className='flex flex-row gap-2'>
            <div className='w-full'>
              <StatsChart />
            </div>
            <VerticalProgress 
              value={stats[stats.length-1].temperature}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

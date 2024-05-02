import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
const uri = window.location.hostname; 
const backend = 'http://'+uri+':3001/'
export type Stat = {
  createdAt: number;
  temperature: number;
  humidity: number;
  humidifier: boolean;
  light: boolean;
}

type StatsState = {
  actions: object;
  lastUpdate: number;
  stats: Stat[];
  fetchStats: () => Promise<void>;
}

const defaultState : StatsState = {
  actions: {},
  lastUpdate: 0,
  stats: [],
  async fetchStats() {
    return;
  },
}

export const StatsContext = createContext(defaultState);

export const useStatsProvider = () => {
  const [stats, setStats] = useState([]);
  const [lastUpdate, setLastUpdate] = useState<number>(0)

  const fetchStats = async () => {
    try {
      const response = await fetch(backend+'info');
      const data = await response.json();
      setStats(data.reverse());
      setLastUpdate(new Date().getTime())
    } catch ( e ) {
      console.log( e )
    }
  };
  
  const _actions = [
    'ON_LED',
    'OFF_LED',
    'ON_FAN',
    'OFF_FAN',
    'ON_HUM',
    'OFF_HUM'
  ];
  const actions = {} 
  _actions.map( (a) => 
    actions[a] = () => fetch(backend + 'action?name='+ a )
  )

  useEffect(() => {
    fetchStats();
    const interval = setInterval( () => {
      fetchStats();
    }, 10000)
    return () => clearInterval(interval)
  }, []);

  return {
    actions,
    lastUpdate,
    stats,
    fetchStats
  }
};


export const useStats = () => {
	return useContext(StatsContext);
};

interface Props {
	children: ReactNode;
}

export const StatsProvider: React.FC<Props> = ({ children }) => {
	const hookData = useStatsProvider();
	return (
		<StatsContext.Provider value={hookData as StatsState}>
			{children}
		</StatsContext.Provider>
	);
};

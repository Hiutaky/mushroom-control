import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

export type Stat = {
  createdAt: number;
  temperature: number;
  humidity: number;
}

type StatsState = {
  lastUpdate: number;
  stats: Stat[];
  fetchStats: () => Promise<void>;
}

const defaultState : StatsState = {
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
    const response = await fetch('http://localhost:8080/info');
    const data = await response.json();
    setStats(data.reverse());
    setLastUpdate(new Date().getTime())
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval( () => {
      fetchStats();
    }, 6000)
    return () => clearInterval(interval)
  }, []);

  return {
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

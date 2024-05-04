import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import Config from '../config';

const backend = 'http://'+Config.host+'3001/'

export type Stat = {
  createdAt: number;
  temperature: number;
  temperatureOut?: number;
  humidity: number;
  humidityOut?: number;
  humidifier: boolean;
  led: boolean;
}

type BackendState = {
  actions: object;
  lastUpdate: number;
  stats: Stat[];
  fetchBackend: () => Promise<void>;
}

const defaultState : BackendState = {
  actions: {},
  lastUpdate: 0,
  stats: [],
  async fetchBackend() {
    return;
  },
}

export const BackendContext = createContext(defaultState);

export const useBackendProvider = () => {
  const [stats, setBackend] = useState([]);
  const [lastUpdate, setLastUpdate] = useState<number>(0)

  const fetchBackend = async () => {
    try {
      const response = await fetch(backend+'info');
      const data = await response.json();
      setBackend(data);
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
    fetchBackend();
    const interval = setInterval( () => {
      fetchBackend();
    }, 30000)
    return () => clearInterval(interval)
  }, []);

  return {
    actions,
    lastUpdate,
    stats,
    fetchBackend
  }
};


export const useBackend = () => {
	return useContext(BackendContext);
};

interface Props {
	children: ReactNode;
}

export const BackendProvider: React.FC<Props> = ({ children }) => {
	const hookData = useBackendProvider();
	return (
		<BackendContext.Provider value={hookData as BackendState}>
			{children}
		</BackendContext.Provider>
	);
};

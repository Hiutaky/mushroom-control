import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { api, type AppWs } from '../../../backend-ts/shared';
import { ActionsName } from '../../../backend-ts/index.d';

export type Stat = {
  createdAt: number;
  temperature: number;
  temperatureOut?: number;
  humidity: number;
  humidityOut?: number;
  humidifier: boolean;
  led: boolean;
  fan: boolean
}

const emptyStat : Stat = {
  createdAt: 0,
  fan: false,
  humidifier: false,
  humidity: 0,
  led: false,
  temperature: 0,
  humidityOut: 0,
  temperatureOut: 0
} 

type BackendState = {
  lastUpdate: number;
  stats: Stat[];
  ws: AppWs | false;
  image: string;
  fetchBackend: () => Promise<void>;
  sendAction: (name: ActionsName ) => Promise<any>;
}

const defaultState : BackendState = {
  lastUpdate: 0,
  stats: [],
  image: "",
  ws: false,
  sendAction(_name) {
    return Promise.reject()
  },
  async fetchBackend() {
    return;
  },
}

export const BackendContext = createContext(defaultState);

export const useBackendProvider = () => {
    const [image, setImage] = useState<string>('');
    const [ws, setWs] = useState<AppWs | false>(false);
    const [stats, setBackend] = useState([emptyStat]);
    const [lastUpdate, setLastUpdate] = useState<number>(0)

    const fetchBackend = async () => {
        try {
          if( ! ws )
            setWs(
                api.ws.subscribe()
            );
          const call = await api.data.get();
          setBackend(call.data);
          setLastUpdate(new Date().getTime())
        } catch ( e ) {
            console.log( e )
        }
    };

    const sendAction = async (name : ActionsName) => {
        const call = await api.action({
            name
        }).get();
        return call.data;
    }

    useEffect( () => {
      if( ! ws ) return;
      ws.on('message', (e) => {
        setImage(e.data as string);
      })
    }, [ws])

    useEffect(() => {
        fetchBackend();
        const interval = setInterval( () => {
            fetchBackend();
        }, 4000)
        return () => clearInterval(interval)
    }, [ws]);

    return {
        lastUpdate,
        image,
        stats,
        ws,
        sendAction,
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

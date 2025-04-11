import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// import { api, type AppWs } from '../../../backend-ts/shared';
// import { ActionsName } from '../../../backend-ts/index.d';


const backend = 'http://localhost:3001/'
type ActionsName = string;
export type Stat = {
  createdAt: number;
  temperature: number;
  temperatureOut?: number;
  humidity: number;
  humidityOut?: number;
  humidifier: boolean;
  led: boolean;
  fan: boolean;
  ioFan: boolean;
  co2: number;
  co2Temp: number;
  co2Hum: number;
}

const emptyStat : Stat = {
  createdAt: 0,
  fan: false,
  humidifier: false,
  humidity: 0,
  led: false,
  temperature: 0,
  humidityOut: 0,
  temperatureOut: 0,
  co2: 0,
  co2Hum: 0,
  co2Temp: 0,
  ioFan: false
} 

type BackendState = {
  lastUpdate: number;
  stats: Stat[];
  ws:  false;
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
    // const [image, setImage] = useState<string>('');
    // const [ws, setWs] = useState< false>(false);
    const [stats, setBackend] = useState([emptyStat]);
    const [lastUpdate, setLastUpdate] = useState<number>(0)

    const fetchBackend = async () => {
        try {
          const response = await fetch(backend+'info');
          const data = await response.json();
          setBackend(data);
            // setWs(
            //     api.ws.subscribe()
            // );
          // const call = await api.data.get();
          // setBackend(call.data);
          setLastUpdate(new Date().getTime())
        } catch ( e ) {
            console.log( e )
        }
    };

    const sendAction = async (name : ActionsName) => {
      await fetch(backend+'action?'+name);
        // const call = await api.action({
        //     name
        // }).get();
        // return call.data;
    }

    // useEffect( () => {
    //   if( ! ws ) return;
    //   ws.on('message', (e) => {
    //     setImage(e.data as string);
    //   })
    // }, [ws])

    useEffect(() => {
        fetchBackend();
        const interval = setInterval( () => {
          try {
            fetchBackend();
          } catch (e ) {
            clearInterval(interval)
          }
        }, 4000)
        return () => clearInterval(interval)
    }, []);

    return {
        lastUpdate,
        image: "",
        stats,
        ws: false,
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

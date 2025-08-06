import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { NetworkState, NetworkStatusHook } from "@/helpers/types";
import { useEffect, useState } from "react";

export function useNetworkStatus(): NetworkStatusHook {
    const [isOnline, setIsOnline] = useState<boolean>(true)
    const [networkInfo, setNetworkInfo] = useState<NetworkState | null>(null)

    useEffect(()=> {
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState)=> {
            const online = Boolean(state.isConnected && state.isInternetReachable);
            setIsOnline(online);
            setNetworkInfo({
                isConnected: state.isConnected,
                isInternetReachable: state.isInternetReachable,
                type: state.type,
                details: state.details
            });
        })

        NetInfo.fetch().then((state: NetInfoState)=> {
            const online = Boolean(state.isConnected && state.isInternetReachable);
            setIsOnline(online);
            setNetworkInfo({
                isConnected: state.isConnected,
                isInternetReachable: state.isInternetReachable,
                type: state.type,
                details: state.details
            });
        })

        return ()=> {
            unsubscribe();
        }
    }, [])

    return {
        isOnline,
        networkInfo
    }
}
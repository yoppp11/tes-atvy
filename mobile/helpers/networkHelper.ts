import NetInfo from '@react-native-community/netinfo';

export const NetworkHelper = {
    async checkConnection(): Promise<boolean>{
        try {
            const state = await NetInfo.fetch()
            return Boolean(state.isConnected && state.isInternetReachable);
        } catch (error) {
            console.log('Error checking network connection:', error);
            return false
        }
    }
}
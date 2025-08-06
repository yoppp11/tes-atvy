import { getSecure } from "./secureStore";
import { PendingAction, SyncResult } from "./types";

interface ProcessedAction extends PendingAction {
    result?: any;
    processed: boolean;
}

export class SyncService {
    static async syncWithServer(): Promise<SyncResult>{
        try {
            const token = await getSecure('access_token');
            if(!token) throw new Error('No access token found');

            const serverTasks = await this.fetchServerTasks(token);
        } catch (error) {
            
        }
    }
}
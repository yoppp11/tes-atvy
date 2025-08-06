import * as sqlite from 'expo-sqlite';
import { Task } from './types'

export interface LocalTask extends Task {
    syncStatus: 'synced' | 'pending_create' | 'pending_update' | 'pending_delete';
    localId?: string;
    serverId?: number;
    lastModified: string;
}

class DatabaseManager{
    private db: sqlite.SQLiteDatabase

    constructor(){
        this.db = sqlite.openDatabaseSync('tasks.db')
        this.initTables()
    }

    private initTables() {
        this.db.execSync(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                localId TEXT UNIQUE,
                serverId INTEGER,
                title TEXT NOT NULL,
                description TEXT,
                dueDate TEXT NOT NULL,
                syncStatus TEXT DEFAULT 'synced',
                lastModified TEXT DEFAULT CURRENT_TIMESTAMP,
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

        this.db.execSync(`
            CREATE INDEX IF NOT EXISTS idx_sync_status ON tasks(syncStatus);
            CREATE INDEX IF NOT EXISTS idx_server_id ON tasks(serverId);
            CREATE INDEX IF NOT EXISTS idx_local_id ON tasks(localId);
        `);
    
    }

    private mapRowToTask(row: any): LocalTask {
        return {
            id: row.serverId || row.localId,
            localId: row.localId,
            serverId: row.serverId,
            title: row.title,
            description: row.description,
            dueDate: row.dueDate,
            syncStatus: row.syncStatus,
            lastModified: row.lastModified,
        };
    }

    getAllTasks(): LocalTask[]{
        const result = this.db.getAllSync('SELECT * FROM tasks WHERE syncStatus != "pending_delete" ORDER BY dueDate ASC')
        return result.map(this.mapRowToTask)
    }

}
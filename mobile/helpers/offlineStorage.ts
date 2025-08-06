import AsyncStorage from '@react-native-async-storage/async-storage';
import { PendingAction, StorageKeys, Task } from './types';

const KEYS: StorageKeys = {
    TASKS: 'tasks',
    PENDING_ACTIONS: 'pending_actions',
    LAST_SYNC: 'last_sync'
} as const

export const OfflineStorage = {
    async getTasks(): Promise<Task[]> {
        try {
            const tasks = await AsyncStorage.getItem(KEYS.TASKS)
            return tasks ? JSON.parse(tasks) : []
        } catch (error) {
            console.log('Error getting tasks from offline storage:', error);
            return []
        }
    },

    async saveTasks(tasks: Task[]): Promise<void> {
        try {
            await AsyncStorage.setItem(KEYS.TASKS, JSON.stringify(tasks))
        } catch (error) {
            console.log('Error saving tasks to offline storage:', error);
        }
    },

    async addTask(task: Partial<Task>): Promise<Task | null> {
        try {
            const tasks = await this.getTasks()
            const newTask: Task = {
                ...task,
                id: task.id || `temp_${Date.now()}`,
                isLocal: !task.id || task.id.toString().startsWith('temp_'),
                title: task.title || '',
                description: task.description || '',
                dueDate: task.dueDate || new Date().toISOString(),
                completed: task.completed || false,
                createdAt: task.createdAt || new Date().toISOString(),
                updatedAt: task.updatedAt || new Date().toISOString()
            }
            tasks.push(newTask)
            await this.saveTasks(tasks)
            return newTask
        } catch (error) {
            console.log('Error adding task to offline storage:', error);
            return null
        }
    },

    async updateTask(taskId: string, updateTask: Partial<Task>): Promise<Task | null>{
        try {
            const tasks = await this.getTasks()
            const index = tasks.findIndex(task => task.id.toString() === taskId.toString())
            if(index !== -1){
                tasks[index] = {
                    ...tasks[index],
                    ...updateTask,
                    updatedAt: new Date().toDateString()
                }
                await this.saveTasks(tasks)
                return tasks[index]
            }
            return null
        } catch (error) {
            console.log('Error updating task in offline storage:', error);
            return null
        }
    },

    async deleteTask(taskId: string): Promise<boolean> {
        try {
            const tasks = await this.getTasks()
            const newTasks = tasks.filter(task => task.id.toString() !== taskId.toString())
            await this.saveTasks(newTasks)
            return true
        } catch (error) {
            console.log('Error deleting task from offline storage:', error);
            return false
        }
    },

    async getPendingActions(): Promise<PendingAction[]>{
        try {
            const actions = await AsyncStorage.getItem(KEYS.PENDING_ACTIONS)
            return actions ? JSON.parse(actions) : []
            
        } catch (error) {
            console.log('Error getting pending actions from offline storage:', error);
            return []
        }
    },

    async addPendingAction(action: Omit<PendingAction, 'id' | 'timestamp'>): Promise<void> {
        try {
            const actions = await this.getPendingActions()
            const newAction: PendingAction = {
                ...action,
                timestamp: Date.now(),
                id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }
            actions.push(newAction)
            await AsyncStorage.setItem(KEYS.PENDING_ACTIONS, JSON.stringify(actions))
        } catch (error) {
            console.log('Error adding pending action to offline storage:', error);
        }
    },

    async clearPendingActions(): Promise<void>{
        try {
            await AsyncStorage.removeItem(KEYS.PENDING_ACTIONS)
        } catch (error) {
            console.log('Error clearing pending actions from offline storage:', error);
            
        }
    },
    
    async removePendingAction(actionId: string): Promise<void>{
        try {
            const actions = await this.getPendingActions()
            const newActions = actions.filter(action => action.id !== actionId)
            await AsyncStorage.setItem(KEYS.PENDING_ACTIONS, JSON.stringify(newActions))
        } catch (error) {
            console.log('Error removing pending action from offline storage:', error);
            
        }
    },

    async setLastSync(timestamp: number = Date.now()): Promise<void>{
        try {
            await AsyncStorage.setItem(KEYS.LAST_SYNC, timestamp.toString())
        } catch (error) {
            console.log('Error setting last sync timestamp in offline storage:', error);
        }
    },

    async getLastSync(): Promise<number> {
        try {
            const timestamp = await AsyncStorage.getItem(KEYS.LAST_SYNC)
            return timestamp ? parseInt(timestamp, 10) : 0
        } catch (error) {
            console.log('Error getting last sync timestamp from offline storage:', error);
            return 0
        }
    }
}
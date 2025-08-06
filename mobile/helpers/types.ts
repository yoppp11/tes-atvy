export interface UserResponse {
    access_token: string;
    id: string;
    username: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    completed?: boolean
    createdAt?: string;
    updatedAt?: string;
    isLocal?: boolean
    lastModified?: string
}

export interface PendingAction {
    id: string
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    taskId?: string;
    data?: Partial<Task>;
    timestamp: number;
    processed?: boolean;
    error?: string
    tempId?: string

}

export interface SyncResult {
    success: boolean
    tasks?: Task[]
    error?: string
    processedActions?: PendingAction[]
}

export interface NetworkState {
    isConnected: boolean | null
    isInternetReachable: boolean | null
    type: string
    details: any
}

export interface StorageKeys {
    TASKS: 'tasks'
    PENDING_ACTIONS: 'pending_actions'
    LAST_SYNC: 'last_sync'
}

export interface UseFetchTaskReturn {
  tasks: Task[];
  loading: boolean;
  syncing: boolean;
  isOnline: boolean;
  addTask: (taskData: Partial<Task>) => Promise<Task | null>;
  updateTask: (taskId: string, taskData: Partial<Task>) => Promise<Task | null>;
  deleteTask: (taskId: string) => Promise<boolean>;
  syncData: () => Promise<void>;
}

export interface CardContentProps {
  task: Task;
  onDelete: (taskId: string) => void;
  isOnline: boolean;
}

export interface NetworkStatusHook {
  isOnline: boolean;
  networkInfo: NetworkState | null;
}
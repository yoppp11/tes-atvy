import Dexie, { type EntityTable } from 'dexie';
import type { PendingAction, Task } from './types';

export const db = new Dexie('MyDatabase') as Dexie & {
    tasks: EntityTable<Task, 'id'>
    pendingActions: EntityTable<PendingAction, 'id'>
}

db.version(1).stores({
    tasks: '++id, title, description, dueDate, createdAt, isLocal, isModified, tempId',
    pendingActions: '++id, type, taskId, taskData, timestamp'
})

// export class TaskDatabase extends Dexie {
//     tasks!: EntityTable<Task, 'id'>
//     pendingActions!: EntityTable<PendingAction, 'id'>

//     constructor() {
//         super('TaskDatabase')
//         this.version(1).stores({
//             tasks: '++id, title, description, dueDate, createdAt, isLocal, isModified, tempId',
//             pendingActions: '++id, type, taskId, taskData, timestamp'
//         })
//     }
// }

// export const db = new TaskDatabase()
export interface User {
    access_token: string
    id: string
    username: string
}

export interface Task {
    id: number
    title: string
    description: string
    dueDate: Date
    created_at: string
    updated_at: string
}
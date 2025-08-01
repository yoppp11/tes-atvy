export interface UserResponse {
    access_token: string;
    id: string;
    username: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    createdAt: string;
    updatedAt: string;
}
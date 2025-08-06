import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import Swal from "sweetalert2"
import { http } from "../helpers/axiosInstance"
import { db } from "../helpers/db"
import { useOfflineSync } from "../helpers/hooks/useOfflineSync"
import type { Task } from "../helpers/types"

export default function EditTask() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: ''
    })
    const [task, setTask] = useState<Task | null>(null)
    const {isOnline, addPendingAction} = useOfflineSync()
    const { id } = useParams<{ id: string }>()
 
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const updateTask: Task = {
                ...task,
                ...formData,
                dueDate: new Date(formData.dueDate),
                isModified: true
            }

            if(task!.id) await db.tasks.update(task!.id, updateTask)
            else if(task!.tempId) await db.tasks.where('tempId').equals(task!.tempId).modify(updateTask)

            if(isOnline && !task!.isLocal){
                try {
                    const response = await http({
                        method: 'put',
                        url: `/tasks/${id}`,
                        data: {
                            title: formData.title,
                            description: formData.description,
                            dueDate: formData.dueDate
                        },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`
                        }
                    })
                    console.log(response);
                    
                    if(task!.id) await db.tasks.update(task!.id, { isModified: false })

                    Swal.fire({
                        icon: 'success',
                        title: 'Task Added',
                        text: 'Your task has been successfully added.',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/home')
                    })
                    
                } catch (error) {
                    console.log(error);
                    if (task!.id) {
                        await addPendingAction({
                            type: 'UPDATE',
                            taskId: task!.id,
                            taskData: updateTask
                        });
                    }

                    Swal.fire({
                        icon: 'info',
                        title: 'Updated Locally',
                        text: 'Task updated locally. Will sync with server when online.',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/home');
                    });
                }
            } else {
                if (task!.id || task!.tempId) {
                    await addPendingAction({
                        type: task!.isLocal ? 'CREATE' : 'UPDATE',
                        taskId: task!.id,
                        taskData: updateTask
                    });
                }

                Swal.fire({
                    icon: 'info',
                    title: 'Updated Offline',
                    text: 'Task updated locally. Will sync with server when online.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/home');
                });
            }

            
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add task. Please try again later.',
                confirmButtonText: 'OK'
            })
        }
    }

    // const handleDelete = async (taskId: string) => {
    //     try {
    //         const result = await Swal.fire({
    //             title: 'Are you sure?',
    //             text: "You won't be able to revert this!",
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonColor: '#3085d6',
    //             cancelButtonColor: '#d33',
    //             confirmButtonText: 'Yes, delete it!'
    //         });

    //         if (result.isConfirmed) {
    //             await http({
    //                 method: 'delete',
    //                 url: `/tasks/${taskId}`,
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem('access_token')}`
    //                 }
    //             });

    //             Swal.fire({
    //                 icon: 'success',
    //                 title: 'Deleted!',
    //                 text: 'Your task has been deleted.',
    //                 confirmButtonText: 'OK'
    //             }).then(() => {
    //                 navigate('/home');
    //             });
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error',
    //             text: 'Failed to delete task. Please try again later.',
    //             confirmButtonText: 'OK'
    //         });
    //     }
    // }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const fetchData = async () => {
        try {
            let foundTask = await db.tasks.where('id').equals(parseInt(id!)).first();

            if(!foundTask) {
                foundTask = await db.tasks.where('tempId').equals(parseInt(id!)).first();
            }

            if(foundTask){
                setTask(foundTask);
                setFormData({
                    title: foundTask.title,
                    description: foundTask.description,
                    dueDate: new Date(foundTask.dueDate).toISOString().split('T')[0]
                });
                return;
            } else if(!isOnline){
                try {
                    const response = await http({
                        method: 'get',
                        url: `/tasks/${id}`,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`
                        }
                    })

                    const serverTask = response.data
                    setTask(serverTask)
                    setFormData({
                        title: serverTask.title,
                        description: serverTask.description,
                        dueDate: new Date(serverTask.dueDate).toISOString().split('T')[0]
                    });

                    await db.tasks.put({
                        ...serverTask,
                        isLocal: false,
                        isModified: false
                    })
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to fetch task data. Please try again later.',
                        confirmButtonText: 'OK'
                    })
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Task Not Found',
                    text: 'Task not found in local storage and you are offline.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/home');
                });
            }
            
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load task data.',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/home');
            });
        }
    }

    useEffect(() => {
        fetchData()
    },[id])

    return (
        <div className="flex min-h-screen min-w-screen justify-center">
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-12 w-120">
                <div className="p-4">
                    <h1 className="text-2xl font-bold">Edit Task</h1>
                </div>
                <form className="p-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="title">Title</label>
                        <input 
                            type="text" 
                            id="title" 
                            className="input input-bordered w-full"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="description">Description</label>
                        <textarea 
                            id="description" 
                            className="textarea textarea-bordered w-full"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="dueDate">Due Date</label>
                        <input 
                            type="date" 
                            id="dueDate" 
                            className="input input-bordered w-full"
                            name="dueDate"
                            value={formData.dueDate} 
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Edit Task</button>
                </form>
            </div>
        </div>
    )
}
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import Swal from "sweetalert2"
import { http } from "../helpers/axiosInstance"
import { db } from "../helpers/db"
import { useOfflineSync } from "../helpers/hooks/useOfflineSync"
import type { Task } from "../helpers/types"

export default function HomePage(){
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const { isOnline, isSync, pendingCount, addPendingAction, syncPendingActions } = useOfflineSync()

    const navigate = useNavigate()

    if(!localStorage.getItem('access_token')) {
        Swal.fire({
            icon: 'warning',
            title: 'Access Denied',
            text: 'You must be logged in to access this page.',
            confirmButtonText: 'Login'
        }).then(()=>  {
            navigate('/login', { replace: true })
        })
    }

    const handleDelete = async (task: Task) => {
        try {

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    if(task.id) await db.tasks.delete(task.id)

                    setTasks(prev => prev.filter(t => t.id !== task.id))
                    
                    if(isOnline && !task.isLocal){
                        try {
                            await http({
                                method: 'delete',
                                url: `/tasks/${task.id}`,
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                                }
                            })

                            Swal.fire({
                                icon: 'success',
                                title: 'Deleted!',
                                text: 'Your task has been deleted.',
                                confirmButtonText: 'OK'
                            }).then(() => {
                                fetchData(); 
                            })

                        } catch (error) {
                            console.log(error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Failed to delete task. Please try again later.',
                                confirmButtonText: 'OK'
                            })
                        }
                    } else if (!task.isLocal && task.id){
                        await addPendingAction({
                            type: 'DELETE',
                            taskId: task.id
                        })

                        Swal.fire({
                            icon: 'info',
                            title: 'Pending',
                            text: 'Your task deletion will be synced when you are back online.',
                            confirmButtonText: 'OK'
                        })
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Your task has been deleted locally.',
                            confirmButtonText: 'OK'
                        })
                    }
                } 
            })
            
        } catch (error) {
            console.log(error);
        }
    }

    const fetchData = async () => {
        try {
            setLoading(true)

            if(isOnline){
                const response = await http({
                    method: 'get',
                    url: '/tasks',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                })

                const serverTasks = response.data.map((el: Task) => ({
                    ...el,
                    isLocal: false,
                    isModified: false
                }))

                await db.tasks.clear()
                await db.tasks.bulkAdd(serverTasks)

                const allLocalTasks = await db.tasks.toArray()
                const localTasks = allLocalTasks.filter(task => task.isLocal === true)
                setTasks([...serverTasks, ...localTasks])
            } else {
                const localTasks = await db.tasks.orderBy('dueDate').toArray()
                setTasks(localTasks)
            }
            // const response = await http({
            //     method: 'get',
            //     url: '/tasks',
            //     headers: {
            //         'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            //     }
            // })
            // console.log(response);
            

            // setTasks(response.data)
            
        } catch (error) {
            console.log(error);
            const localTasks = await db.tasks.toArray()

            setTasks(localTasks);

            if (isOnline) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Connection Error',
                    text: 'Failed to fetch latest data from server. Showing cached data.',
                    confirmButtonText: 'OK'
                });
            }
        } finally {
            setLoading(false);
        }
    }

    const handleManualSync = async () => {
        if(!isOnline){
            Swal.fire({
                icon: 'info',
                title: 'Offline Mode',
                text: 'You are currently offline. Please connect to the internet to sync your data.',
                confirmButtonText: 'OK'
            })
            return
        }

        await syncPendingActions()
        await fetchData()
    }

    useEffect(()=> {
        fetchData()
    }, [isOnline])
 
    return (
        <div className="flex min-h-screen min-w-screen justify-center">
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-12">
                <div className="flex p-4 justify-end gap-2">
                    <button 
                        onClick={handleManualSync}
                        className="btn btn-sm btn-outline btn-primary"
                        disabled={isSync}
                    >
                        {isSync ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Syncing...
                            </>
                        ) : (
                            'Sync Now'
                        )}
                    </button>
                    <button onClick={()=> navigate('/add-task')} className="btn btn-soft btn-accent">+ Add Task</button>
                </div>
                <table className="table">
                    
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name Task</th>
                            <th>Description</th>
                            <th>Due Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => {
                            return (
                                <tr key={task.id}>
                                    <th>{index + 1}</th>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>
                                        {new Date(task.dueDate).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        <div className="flex flex-row justify-between">
                                            <button onClick={()=> navigate('/edit-task/' + task.id)} className="btn btn-soft btn-primary mr-2">Edit</button>
                                            <button onClick={()=> {
                                                handleDelete(task)
                                            }} className="btn btn-soft btn-error">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
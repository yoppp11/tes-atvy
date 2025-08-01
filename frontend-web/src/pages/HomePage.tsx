import { useNavigate } from "react-router"
import Swal from "sweetalert2"
import { http } from "../helpers/axiosInstance"
import type { Task } from "../helpers/types"
import { useEffect, useState } from "react"

export default function HomePage(){
    const [tasks, setTasks] = useState<Task[]>([])

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

    const handleDelete = async (taskId: number) => {
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
                    await http({
                        method: 'delete',
                        url: `/tasks/${taskId}`,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`
                        }
                    });
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Your task has been deleted.',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        fetchData(); 
                    });
                }
            })
            
        } catch (error) {
            console.log(error);
        }
    }

    const fetchData = async () => {
        try {
            const response = await http({
                method: 'get',
                url: '/tasks',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            console.log(response);
            

            setTasks(response.data)
            
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch data. Please try again later.',
                confirmButtonText: 'OK'
            })
        }
    }

    useEffect(()=> {
        fetchData()
    }, [])
 
    return (
        <div className="flex min-h-screen min-w-screen justify-center">
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-12">
                <div className="flex p-4 justify-end">
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
                                                handleDelete(task.id)
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
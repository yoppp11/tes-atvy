import { useState } from "react"
import { useNavigate } from "react-router"
import Swal from "sweetalert2"
import { http } from "../helpers/axiosInstance"

export default function AddTask() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: ''
    })

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await http({
                method: 'post',
                url: '/tasks',
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
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add task. Please try again later.',
                confirmButtonText: 'OK'
            })
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <div className="flex min-h-screen min-w-screen justify-center">
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-12 w-120">
                <div className="p-4">
                    <h1 className="text-2xl font-bold">Add Task</h1>
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
                    <button type="submit" className="btn btn-primary">Add Task</button>
                </form>
            </div>
        </div>
    )
}
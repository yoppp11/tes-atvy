const {task} = require("../models/");

module.exports = class TaskController {
    static async routeCreateTask(req, res, next){
        try {
            const { title, description, dueDate } = req.body
            const userId = req.user.id

            if(!title) throw { name: 'BadRequest', message: 'Title is required' }
            if(!description) throw { name: 'BadRequest', message: 'Description is required' }
            if(!dueDate) throw { name: 'BadRequest', message: 'Due date is required' }

            const newTask = await task.create({
                title,
                description,
                dueDate,
                userId: userId
            })

            return res.status(201).send({
                id: newTask.id,
                title: newTask.title,
                description: newTask.description,
                dueDate: newTask.dueDate,
                userId: newTask.userId
            });
            
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async routeGetAllTasks(req, res, next){
        try {
            const userId = req.user.id
            console.log(req.user);
            console.log(req.headers);

            const tasks = await task.findAll({
                where: { userId: userId },
                order: [['dueDate', 'ASC']],
                attributes: ['id', 'title', 'description', 'dueDate', 'createdAt', 'updatedAt']
            })

            console.log(tasks);

            return res.status(200).send(tasks);
            
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async routeEditTask(req, res, next){
        try {
            const { id } = req.params
            const { title, description, dueDate } = req.body
            const userId = req.user.id
            if(!title) throw { name: 'BadRequest', message: 'Title is required' }
            if(!description) throw { name: 'BadRequest', message: 'Description is required' }
            if(!dueDate) throw { name: 'BadRequest', message: 'Due date is required' }

            const taskToUpdate = await task.findOne({
                where: { id: id, userId: userId }
            })

            if(!taskToUpdate) throw { name: 'NotFound', message: 'Task not found' }

            const updatedTask = await taskToUpdate.update({
                title,
                description,
                dueDate
            })

            return res.status(200).send({
                id: updatedTask.id,
                title: updatedTask.title,
                description: updatedTask.description,
                dueDate: updatedTask.dueDate,
                userId: updatedTask.userId
            });
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeDeleteTask(req, res, next){
        try {
            const { id } = req.params
            const userId = req.user.id

            const taskToDelete = await task.findOne({
                where: { id: id, userId: userId }
            })

            if(!taskToDelete) throw { name: 'NotFound', message: 'Task not found' }

            await taskToDelete.destroy()

            return res.status(200).send({ message: 'Task deleted successfully' });
            
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async routeGetTaskById(req, res, next){
        try {
            const { id } = req.params
            const userId = req.user.id

            const taskToGet = await task.findOne({
                where: { id: id, userId: userId },
                attributes: ['id', 'title', 'description', 'dueDate', 'createdAt', 'updatedAt']
            })

            if(!taskToGet) throw { name: 'NotFound', message: 'Task not found' }

            return res.status(200).send(taskToGet);
            
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}
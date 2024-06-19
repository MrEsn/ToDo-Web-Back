import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SuccessResponse } from 'App/Exceptions/ApiResponseException'
import { ErrorHandler } from 'App/Exceptions/ErrorHandlerException'
import { NotFoundError } from 'App/Exceptions/ErrorHandlerException'
import Status from 'App/Models/Status'
import Task from 'App/Models/Task'
import CreateTaskValidator from 'App/Validators/CreateTaskValidator'

export default class TasksController {
    async index({request, response, auth, params}: HttpContextContract) {
        const req = request.all()
        const auth_user = await auth.user;
        try {
            const result = await Status.query()
                .where('id', params.id)
                .preload('tasks', (taskQuery) => {
                     taskQuery.where('user_id', auth_user?.id)
                     taskQuery.where(req.filter)
                     taskQuery.where('title', 'LIKE', '%'+req.search+'%')
                     taskQuery.orderBy(req.orderBy, req.orderType)
                })
            return new SuccessResponse(response, result)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }

    async store({request, response, auth}: HttpContextContract) {
        const data = await request.validate(CreateTaskValidator)
        const auth_user = auth.user
        try {
            const task = await Task.create({...data, userId: auth_user?.id})
            return new SuccessResponse(response, task)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }

    async update({params,request,response}:HttpContextContract){
        try {
            let task = await Task.find(params.id)
            const data = request.all()
            if (!task) {
                return ErrorHandler.handle(new NotFoundError(), response)
            }
            task.merge(data)
            const updated = await task.save()
            return new SuccessResponse(response, updated)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }


    async destroy({params, response}: HttpContextContract){
        let task = await Task.find(params.id)
        if (!task) {
            return ErrorHandler.handle(new NotFoundError(), response)
        }
        try {
            await task.delete()
            return new SuccessResponse(response, 'Removed successfully')
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }
}


// async index({request, response, auth}: HttpContextContract){
//         const auth_user = auth.user
//         let req = request.all()
//         req.filter.user_id = auth_user?.id
//         try {
//             const tasks = await Task.query()
//             .where(req.filter)
//             .where('title', 'like', "%"+req.search+"%")
//             .orderBy(req.orderBy, req.orderType)
//             .paginate(req.page , req.perPage)
//         return tasks
//         } catch (error) {
//             console.log(error);
//             return response.status(500).json({status:'error' ,  message: "error"})
//         }
//     }
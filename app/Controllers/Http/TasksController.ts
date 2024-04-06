import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SuccessResponse } from 'App/Exceptions/ApiResponseException'
import { ErrorHandler } from 'App/Exceptions/ErrorHandlerException'
import { NotFoundError } from 'App/Exceptions/ErrorHandlerException'
import Task from 'App/Models/Task'

export default class TasksController {
    
    async store({request, response, auth}: HttpContextContract) {
        const data = request.only(['title' , 'description' , 'priority' ,'user_id', 'category_id', 'status_id'])
        const auth_user = auth.user
        data.user_id = auth_user?.id
        try {
            const task = await Task.create(data)
            return new SuccessResponse(response, task)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }

    async update({params,request,response}:HttpContextContract){
        try {
            let task = await Task.find(params.id)
            const data = request.only(['title', 'description', 'priority', 'status_id', 'category_id'])
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
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SuccessResponse } from 'App/Exceptions/ApiResponseException'
import Task from 'App/Models/Task'
import { ErrorHandler } from 'App/Exceptions/ErrorHandlerException'
import Status from 'App/Models/Status'


export default class StatusesController {

    async index({response, auth}: HttpContextContract){
        const auth_user = await auth.user;
        try {
            const statuses = await Status.query()
                .where('user_id', auth_user?.id)
            return new SuccessResponse(response, statuses)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }

    async store({request, response, auth}: HttpContextContract) {
        const user = await auth.user
        const {title} = request.all()
        try {
            const status = await Status.create({title: title, user_id: user?.id})
            return new SuccessResponse(response, status)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }

    async update({request, response, params}: HttpContextContract){
        const status = await Status.findOrFail(params.id)
        const {title} = request.only(['title'])
        try {
            status.merge({title})
            await status.save()
            return new SuccessResponse(response, status)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }

    
    async destroy({params, response}: HttpContextContract){
        const status = await Status.findOrFail(params.id)
        try {
            const update = await status.delete()
            return new SuccessResponse(response, update)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }
}



//const result: { id: number; name: string; data: any[]; }[] = [];
// for(const item of status){
//     const tasks = await Task.query()
//         .where('user_id', auth_user?.id)
//         .where('status_id', item.id)
//         .where(req.filter)
//         .where('title', 'like', "%" + req.search + "%")
//         .orderBy(req.orderBy, req.orderType)
//     result.push({
//         id: item.id,
//         name: item.title, 
//         data: tasks
//     })
// }
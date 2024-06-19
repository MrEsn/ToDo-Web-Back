import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SuccessResponse } from 'App/Exceptions/ApiResponseException'
import { ErrorHandler, NotFoundError } from 'App/Exceptions/ErrorHandlerException'
import Category from 'App/Models/Category'
import Task from 'App/Models/Task'

export default class CategoriesController {

    async index({response, auth}: HttpContextContract ) {
        const auth_user = auth.user
        try {
            const categories = await Category.query()
                .where('user_id', auth_user?.id)
            return new SuccessResponse(response, categories)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }

    async store({request, response, auth}: HttpContextContract) {
        const auth_user = await auth.user
        const titles = request.input('titles') as string[];
        try {
            const categoryData = titles.map(title => ({
                title: title,
                user_id: auth_user?.id
            }))
            const newCat = await Category.createMany(categoryData)
            return new SuccessResponse(response, newCat,)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }
 
    async update({request, response, params}: HttpContextContract){
        const cat = await Category.findOrFail(params.id)
        const {title} = request.only(['title'])
        try {
            cat.merge({title})
            await cat.save()
            return new SuccessResponse(response, cat)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }


    async destroy({params, response}: HttpContextContract){
        let cat = await Category.find(params.id)
        if (!cat) {
            return ErrorHandler.handle(new NotFoundError(), response)
        }
        try {
            await cat.delete()
            return new SuccessResponse(response, 'Categories and tasks cleared successfully')
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }
     
}

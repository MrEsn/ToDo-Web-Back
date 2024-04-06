import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SuccessResponse } from 'App/Exceptions/ApiResponseException'
import { ErrorHandler } from 'App/Exceptions/ErrorHandlerException'
import Category from 'App/Models/Category'

export default class CategoriesController {
    async store({request, response, auth}: HttpContextContract) {
        const auth_user = await auth.user
        const titles = request.input('titles') as string[];
        try {
            titles.forEach(async (title) => {
                await Category.create({ title: title, user_id:  auth_user?.id});
            });
            return new SuccessResponse(response, 'Categories added successfully')
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }
 

    async index({response, auth}: HttpContextContract ) {
        const auth_user = auth.user
        try {
            const categories = Category.query()
                .where('user_id', auth_user?.id)
            return new SuccessResponse(response, categories)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }


    async update({ request, response}: HttpContextContract) {
        const data = request.input('data') as [string, string][];
        try {
            for (const [currentTitle, newTitle] of data) {
                const category = await Category.findBy('title', currentTitle);
                if (category) {
                    category.merge({ title: newTitle });
                    await category.save();
                }
            }
            return new SuccessResponse(response, 'Categories updated successfully')
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }


    async delete({ request, response }: HttpContextContract) {
        const titles = request.input('titles') as string[]; 
    
        try {
            await titles.forEach(async (title) => {
                const category = await Category.findBy('title', title);
                if (category) {
                    await category.delete();
                }
            });
            return new SuccessResponse(response, 'Categories cleared successfully')
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }
}
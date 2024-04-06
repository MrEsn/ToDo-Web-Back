import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SuccessResponse } from 'App/Exceptions/ApiResponseException'
import { NotFoundError } from 'App/Exceptions/ErrorHandlerException'
import { ErrorHandler } from 'App/Exceptions/ErrorHandlerException'
import Note from 'App/Models/Note'

export default class NotesController {
    async store({request, response, auth}: HttpContextContract) {
        const data = request.only(['title', 'description', 'user_id'])
        const auth_user = auth.user
        data.user_id = auth_user?.id
        try {
            const note = await Note.create(data)
            return new SuccessResponse(response, note)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }

    async update({params,request,response}:HttpContextContract){
        try {
            let note = await Note.find(params.id)
            const data = request.only(['title', 'description'])
            if (!note) {
                return ErrorHandler.handle(new NotFoundError(), response)
            }
            note.merge(data)
            const updated = await note.save()
            return new SuccessResponse(response, updated)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }

    async destroy({params, response}: HttpContextContract){
        let note = await Note.find(params.id)
        if (!note) {
            return ErrorHandler.handle(new NotFoundError(), response)
        }
        try {
            await note.delete()
            return new SuccessResponse(response, 'Removed successfully')
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }

    async index({response, auth}: HttpContextContract ) {
        const auth_user = auth.user
        try {
            const notes = Note.query()
                .where('user_id', auth_user?.id)
            return new SuccessResponse(response, notes)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }

}

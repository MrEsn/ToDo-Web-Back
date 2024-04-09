import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { SuccessResponse } from 'App/Exceptions/ApiResponseException'
import { ErrorHandler } from 'App/Exceptions/ErrorHandlerException'

export default class AuthController {

    async register({request, response, auth}: HttpContextContract) {
        const userSchema = schema.create({
            user_name: schema.string({trim : true}, [
                rules.maxLength(70),
                rules.minLength(5)
            ]),
            email: schema.string({},[
                rules.email(),
                rules.maxLength(255),
                rules.unique({table: 'users', column: 'email'})
            ]),
            password: schema.string({},[
                rules.maxLength(255),
                rules.confirmed('password_confirmation')
            ])
        })
        const data = await request.validate({schema: userSchema})
        try {
            const user = await User.create(data)
            const token = await auth.use('api').generate(user)
            return new SuccessResponse(response, token)
        } catch (error) {
            ErrorHandler.handle(error, response)
        }
    }
   
    public async login({request, response, auth}: HttpContextContract){
        const {uid, password} = request.only(['uid', 'password'])
        try {
            const token = await auth.use('api').attempt(uid, password)
            return new SuccessResponse(response, token)
        } catch(error){
            ErrorHandler.handle(error, response)
        }
     }


     public async logout({response, auth}: HttpContextContract){
        await auth.logout()
        return new SuccessResponse(response, 'با موفقیت از سیستم خارج شد')
     }


     //! github

     public async github({ally}: HttpContextContract){
        return ally.use('github').redirect()
     }


     public async github_callback({auth, ally, response}: HttpContextContract){
        const github = ally.use('github')
         const githubUser = await github.user()
         try {
            const user = await User.firstOrCreate({
                email: githubUser.email!,
             },{
                user_name: githubUser.name,
                email: githubUser.email!,
                profileUrl: githubUser.avatarUrl!,
                provider: "github",
             })
                    const token = await auth.use('api').login(user)
                    return new SuccessResponse(response, token)
            } catch (error) {
                ErrorHandler.handle(error, response)
            }
     }

     //! google

     public async google({ ally}: HttpContextContract){
        return ally.use('google').redirect()
     }


     public async google_callback({ response, auth, ally}: HttpContextContract){
         const google = ally.use('google')
         const googleUser = await google.user()
             try {
                 const user = await User.firstOrCreate({
                    email: googleUser.email!,
                 },{
                    user_name: googleUser.name,
                    email: googleUser.email!,
                    profileUrl: googleUser.avatarUrl!,
                    provider: "google",
                 })
                    const token = await auth.use('api').login(user)
                    return new SuccessResponse(response, token)
            } catch (error) {
                ErrorHandler.handle(error, response)
            }
    }
}

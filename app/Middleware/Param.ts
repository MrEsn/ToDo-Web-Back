import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import Task from 'App/Models/Task'
export default class Param {
  public async handle({request}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    let req = request.all()

    let orderType: 'asc' | 'desc' = request.input('orderType', 'asc')
    
    
    let filter:{[key: string]: any} = {}
    if (req.filter) {
      filter = JSON.parse(req.filter)
    }
    request.all().filter = filter
    request.all().orderBy = request.input('orderBy', 'id')
    request.all().orderType = orderType
    request.all().page = request.input('page', '1')
    request.all().per_page = request.input('perPage', '10')
    if(req.search){
      request.all().search = req.search
    }
    await next()
  }
}
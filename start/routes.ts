import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {
  //Route.get('/','TasksController.index')
  //Route.get('/:id','TasksController.show')
  Route.post('/', 'TasksController.store')
  Route.put('/:id','TasksController.update')
  Route.delete('/:id', 'TasksController.destroy')
}).prefix('api/tasks').middleware('auth')


Route.group(()=>{
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.get('/logout', 'AuthController.logout')

  Route.get('/google', 'AuthController.google')
  Route.get('/google/callback', "AuthController.google_callback")
    
  Route.get('/github', 'AuthController.github')
  Route.get('/github/callback', 'AuthController.github_callback')
}).prefix('api/auth')


Route.group(() => {
  Route.post('/', 'StatusesController.store')
  Route.put('/:id', 'StatusesController.update')
  Route.delete('/:id', 'StatusesController.destroy')
  Route.get('/', 'StatusesController.index').middleware('handle')

}).prefix('api/status').middleware('auth')

Route.group(()=>{
  Route.post('/', 'CategoriesController.store')
  Route.get('/', 'CategoriesController.index')
  Route.put('/', 'CategoriesController.update')
  Route.delete('/', 'CategoriesController.delete')

}).prefix('api/category').middleware('auth')

Route.group(()=>{
  Route.post('/', 'NotesController.store')
  Route.get('/', 'NotesController.index')
  Route.put('/', 'NotesController.update')
  Route.delete('/', 'NotesController.delete')
}).prefix('api/note').middleware('auth')
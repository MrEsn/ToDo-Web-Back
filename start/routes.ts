import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {
  Route.get('/index/:id','TasksController.index').middleware('handle')
  Route.post('/add', 'TasksController.store')
  Route.put('/update/:id','TasksController.update')
  Route.delete('/delete/:id', 'TasksController.destroy')
}).prefix('api/tasks').middleware('auth')


Route.group(()=>{
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.get('/logout', 'AuthController.logout')

  Route.get('/google', 'AuthController.google')
  Route.get('/google/callback', "AuthController.google_callback")
    
  Route.get('/github', 'AuthController.github')
  Route.get('/github/callback', 'AuthController.github_callback')

  Route.get('/getip', 'AuthController.get_ip')
}).prefix('api/auth')


Route.group(() => {
  Route.get('/index', 'StatusesController.index')
  Route.post('/add', 'StatusesController.store')
  Route.put('update/:id', 'StatusesController.update')
  Route.delete('/delete/:id', 'StatusesController.destroy')

}).prefix('api/status').middleware('auth')

Route.group(()=>{
  Route.get('/index', 'CategoriesController.index')
  Route.post('/add', 'CategoriesController.store')
  Route.put('/update/:id', 'CategoriesController.update')
  Route.delete('/delete/:id', 'CategoriesController.destroy')

}).prefix('api/category').middleware('auth')

Route.group(()=>{
  Route.get('/index', 'NotesController.index')
  Route.post('/add', 'NotesController.store')
  Route.put('/update/:id', 'NotesController.update')
  Route.delete('/delete/:id', 'NotesController.destroy')
}).prefix('api/note').middleware('auth')
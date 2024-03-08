import {Router} from 'express'
import { deleted, login, signUp, signUpAdmin, test, update } from './user.controller.js'
import { isAdmin, validateJwt } from '../middleware/validation.js'

const api = Router()
api.post('/signUp', signUp)
api.post('/signUpAdmin', [validateJwt, isAdmin], signUpAdmin)
api.post('/login',  login)
api.put('/update/:id', [validateJwt], update)
api.delete('/delete/:id', [validateJwt], deleted)

export default api
import {Router} from 'express'
import { add, deleted, find, update } from './category.controller.js'
import { isAdmin, validateJwt } from '../middleware/validation.js'


const api = Router()

api.post('/add', add)
api.delete('/delete/:id',[validateJwt, isAdmin], deleted)
api.put('/update/:id',[validateJwt, isAdmin], update)
api.get('/find', find)

export default api
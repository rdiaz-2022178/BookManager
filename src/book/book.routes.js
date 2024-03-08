import {Router} from 'express'
import { add } from './book.controller.js'

const api = Router()

api.post('/add', add)

export default api
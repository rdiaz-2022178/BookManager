import {hash, compare} from 'bcrypt'

export const encrypt = (password)=>{
    try {
        return hash(password, 10)
    } catch (error) {
        console.error(error)
        return error
    }
}

export const comparePassword = async(password, hash)=>{
    try {
        return await compare(password, hash)
    } catch (error) {
        console.error(error);
        return error  
    }
}

export const checkUpdateUser = (data, id) => {
    if (id) {
        if (
            Object.entries(data).length === 0 ||
            data.name == '' ||
            data.username == '' ||
            data.email ||
            data.password == '' ||
            data.role == '' ||
            data.role

        ) {
            return false
        }
        return true
    }
}

export const checkUpdateAdmin = (data, id)=>{
    if (id) {
        if (
            Object.entries(data).length === 0 ||
            data.name == '' ||
            data.username == '' ||
            data.email == '' ||
            data.password ||
            data.password == '' ||
            data.role == ''

        ) {
            return false
        }
        return true
    }
} 

export const checkUpdateCategory = (data, id) => {
    if (id) {
        if (
            Object.entries(data).length === 0 ||
            data.name == '' ||
            data.description == '' 

        ) {
            return false
        }
        return true
    }
}

export const checkUpdateBook = (data, id) => {
    if (id) {
        if (
            Object.entries(data).length === 0 ||
            data.name == '' ||
            data.description == '' 

        ) {
            return false
        }
        return true
    }
}
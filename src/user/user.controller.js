import { generateJwt } from '../../utils/jwt.js'
import { comparePassword, encrypt, checkUpdateUser, checkUpdateAdmin } from '../../utils/validator.js'
import User from '../user/user.model.js'
import jwt from 'jsonwebtoken'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test good' })
}

export const signUp = async (req, res) => {
    try {
        let data = req.body
        let existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            return res.status(400).send({ message: 'Username is already in use' });
        }
        data.password = await encrypt(data.password)
        data.role = 'USER'
        let user = new User(data)

        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}

export const signUpAdmin = async (req, res) => {
    try {
        let data = req.body
        let existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            return res.status(400).send({ message: 'Username is already in use' });
        }
        data.password = await encrypt(data.password)
        data.role = 'ADMIN'
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}

export const defaultAdmin = async () => {
    try {
        const existingUser = await User.findOne({ username: 'default' });

        if (existingUser) {
            return; 
        }
        let data = {
            name: 'Default',
            username: 'default',
            email: 'default@gmail.com',
            password: await encrypt('hola'),
            role: 'ADMIN'
        }

        let user = new User(data)
        await user.save()

    } catch (error) {
        console.error(error)
    }
}

export const login = async (req, res) => {
    try {
        let { user, password } = req.body
        let users = await User.findOne({
            $or: [
                { username: user },
                { email: user }
            ]
        });
        if (users && await comparePassword(password, users.password)) {
            let loggedUser = {
                uid: users.id,
                username: users.username,
                name: users.name,
                role: users.role
            }
            let token = await generateJwt(loggedUser)
            return res.send({ message: `Welcome ${loggedUser.name}`, loggedUser, token })

        }
        return res.status(404).send({ message: 'Invalid credentials' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let uid = req.user._id
        let role = req.user.role
        switch (role) {
            case 'ADMIN':
                let update = checkUpdateAdmin(data, id)
                if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
                let updatedUser = await User.findOneAndUpdate(
                    { _id: id }, //ObjectsId <- hexadecimales (Hora sys, Version Mongo, Llave privada...)
                    data, //Los datos que se van a actualizar
                    { new: true } //Objeto de la BD ya actualizado
                )
                if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
                return res.send({ message: 'Updated user', updatedUser })
                break;

            case 'USER':
                let updated = checkUpdateUser(data, id)
                if(id != uid) return  res.status(401).send({ message: 'you can only update your account' })
                if (!updated) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
                let updatedUsers = await User.findOneAndUpdate(
                    { _id: uid }, //ObjectsId <- hexadecimales (Hora sys, Version Mongo, Llave privada...)
                    data, //Los datos que se van a actualizar
                    { new: true } //Objeto de la BD ya actualizado
                )
                if (!updatedUsers) return res.status(401).send({ message: 'User not found and not updated' })
                return res.send({ message: 'Updated user', updatedUsers })
                break;
        }

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating account' })
    }
}

export const deleted = async (req, res) => {
    try {
        let { id } = req.params
        let { validationWord } = req.body
        let uid = req.user._id
        let role = req.user.role
        switch (role) {
            case 'ADMIN':
                if (!validationWord) return res.status(400).send({ message: `valitaion word IS REQUIRED.` });
                if (validationWord !== 'CONFIRM') return res.status(400).send({ message: `valitaion word must be -> CONFIRM` });
                let deletedUser = await User.findOneAndDelete({ _id: id })
                if (!deletedUser) return res.status(404).send({ message: 'Account not found and not deleted' })
                return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` }) //status 200
                break;

            case 'USER':
                if (!validationWord) return res.status(400).send({ message: `valitaion word IS REQUIRED.` });
                if (validationWord !== 'CONFIRM') return res.status(400).send({ message: `valitaion word must be -> CONFIRM` });
                if(id != uid) return  res.status(401).send({ message: 'you can only delete your account' })
                let deletedUsers = await User.findOneAndDelete({ _id: uid })
                if (!deletedUsers) return res.status(404).send({ message: 'Account not found and not deleted' })
                return res.send({ message: `Account with username ${deletedUsers.username} deleted successfully` }) //status 200
                break;
        }

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}
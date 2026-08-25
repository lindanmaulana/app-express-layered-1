import {Router} from 'express'
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware.js'
import { USER_ROLE } from '../constants/user-role.constant.js'
import { validate } from '../middlewares/validate.js'
import { getUsersQuerySchema } from '../validations/user.validation.js'
import { adminUserController } from '../controllers/admin-user.controller.js'
import { idParamSchema } from '../validations/param.validation.js'
import { changeUserRoleSchema } from '../validations/admin-user.validation.js'

const router = Router()

    router.get("/", authenticate, authorizeRoles(USER_ROLE.ADMIN), validate({query: getUsersQuerySchema}), adminUserController.getAll)
    router.delete("/:id", authenticate, authorizeRoles(USER_ROLE.ADMIN), validate({params: idParamSchema}), adminUserController.delete)
    router.patch("/:id/role", authenticate, authorizeRoles(USER_ROLE.ADMIN), validate({params: idParamSchema, body: changeUserRoleSchema}), adminUserController.changeRole)

export default router
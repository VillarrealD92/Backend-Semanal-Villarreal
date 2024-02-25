export const justPublicWitoutSession = (req, res, next) => {
    if (!req.cookies.cookieUS) return res.redirect('/api/session/login')

    return next()
}

export const authorization = (roles) => {

    return async (req, res, next) => {

        const { user } = req.user;

        if (!user) return res.status(400).send({ error: 'Error' })

        if (roles.indexOf(user.role) !== -1 ) {
            return next()
        }
        return res.status(403).send({ error: 'Not allowed', access: roles, user:user.role })
       
    }
}

export const chatOnlyForUser = (role) => {

    return async (req, res, next) => {
        const { user } = req.user;

        if (user.role !== role) return res.send({ Answer: 'only users' })

        return next()
    }
}
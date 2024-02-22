

export const checkRegisteredUser = (req, res, next) => {
    if(req.session?.user) return res.redirect("/profile")
    return next()
}

export const auth = (req, res, next) => {
    if(req.session?.user) return next()
    res.redirect('/')
}

export const checkAdminPermissions = (req, res, next) => {
    const sessionActive = req.session.user
    if (sessionActive == undefined) return res.send("Please Login")
    if(req.session.user.role !== "admin") return res.status(403).send("Not allowed")
    next()
}

export const checkUserPermissions = (req, res, next) => {
    const sessionActive = req.session.user
    if (sessionActive == undefined) return res.send("Please Login")
    if(req.session.user.role !== "user") return res.status(403).send("Not allowed")
    next()
}
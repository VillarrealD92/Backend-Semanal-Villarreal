export const register = async (req, res) => {

    res.redirect('/api/session/login');
}

export const login = async (req, res) => {

    res.cookie('cookieUS', req.user.token).redirect('/');
}

export const current = async (req, res) => {

    req.session.destroy(error => { if (error) return res.send('Error al cerrar session') });
    res.clearCookie('cookieUS');

    return res.redirect('/api/session/login')
}

export const githubcallback = (req, res) => {
    res.cookie('cookieUS', req.user.token).redirect('/');
}
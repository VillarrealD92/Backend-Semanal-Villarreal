import UserDTO from "../DTO/user.dto.js";


export const login = async(req, res) => {
    try {
        if (!req.user) return res.status(401).send("Invalid Credentials")
        console.log(req.user);
        req.session.user = req.user
        return res.status(200).redirect("/products")
    } catch (error) {
        return res.status(500).send("Couldn't login. Error message: " + error)
    }
}

export const github = (req,res) => {}

export const githubCallback = (req,res) => {   
    try {
        req.session.user = req.user
        res.status(200).redirect("/products")
    } catch (error) {
        res.status(500).send("GitHubCallback has failed." + error)   
    }
}

export const register = async(req, res) => { 
    try {
        return res.status(201).redirect("/")
    } catch (error) {
        return res.status(500).send("Couldn't process your registe request" + error)
    }  
}

export const logout = (req, res) => {
    try {
        req.session.destroy(err => {
            if(err) return res.send("Logout error")
            return res.redirect("/")
        })         
    } catch (error) {
        return res.status(500).send("Failed to logout")
    }
}

export const current = (req, res) =>{
    try {
		const user = req.session.user;
        const userDTO = new UserDTO(user)
		return res.send(userDTO);
	} catch (error) {
		res.status(500).send("Couldnt get current user informatio. Error Message: " + error);
	}
}
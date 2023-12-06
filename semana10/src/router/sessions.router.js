import { Router } from "express";
import userModel from "../dao/models/users.model.js";

const router= Router();

router.post('/register', async (req,res)=>{

    const user= req.body;

    if(user.email == 'adminCoder@coder.com' && user.password != 'adminCod3r123' ) {
        return res.status(401).send({error:'Usuario no autorizado'})
    }

    if(user.email == 'adminCoder@coder.com' && user.password == 'adminCod3r123'){
        user.role= 'admin'
    }

    try {
    await userModel.create(user);

    return res.redirect('/api/session/login');
    } catch (error) {
        res.status(400).send({fail:error})
    }
})


router.post('/login', async (req,res) =>{

const {email, password}= req.body;
const user= await userModel.findOne({email,password});

if(!user) return res.status(404).send('User Not Found');

req.session.user = {email: user.email, name:user.name, role:user.role, age:user.age, last_name:user.last_name}

return res.redirect('/')

});


router.post('/profile', async (req,res) =>{

    req.session.destroy(error => {if(error) return res.send('Error al cerrar session')})
    
    return res.redirect('/api/session/login')
    
})



export default router
export default class UserDTO{

    constructor(user){
        this.name= user.name
        this.last_name=user.last_name
        this.age= user.age
        this.role= user.role
        this.email= user.email
        this.cartUser= user.cartUser
    }
}
export default class UserDTO{

    constructor(user){
        this.name = user.name ? user.name.toString().trim() : '';
        this.last_name = user.last_name ? user.last_name.toString().trim() : '';
        this.age = this.sanitizeAge(user.age);
        this.role = user.role ? user.role.toString().trim() : '';
        this.email = this.sanitizeEmail(user.email);
        this.cartUser = user.cartUser ? user.cartUser.toString().trim() : '';
    }
}
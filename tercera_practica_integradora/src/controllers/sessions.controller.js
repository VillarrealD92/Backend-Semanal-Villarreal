import { validatePassword, createHash } from "../utils.js";
import { userService } from "../services/index.repositories.js";
import UserDTO from "../DTO/user.dto.js";

export async function login(req, res) {
    try {
        if (!req.user) return res.status(401).send("Credenciales inválidas");
        req.session.user = req.user;
        return res.status(200).redirect("/products");
    } catch (error) {
        return res.status(500).send("No se pudo iniciar sesión. Mensaje de error: " + error);
    }
}

export const github = (req, res) => {};

export const githubCallback = (req, res) => {
    try {
        req.session.user = req.user;
        res.status(200).redirect("/products");
    } catch (error) {
        res.status(500).send("Fallo de GitHubCallback." + error);
    }
}

export const register = async (req, res) => {
    try {
        return res.status(201).redirect("/");
    } catch (error) {
        return res.status(500).send("No se pudo procesar tu solicitud de registro" + error);
    }
}

export const logout = (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) return res.send("Error al cerrar sesión");
            return res.redirect("/");
        });
    } catch (error) {
        return res.status(500).send("Error al cerrar sesión");
    }
}

export const current = (req, res) => {
    try {
        const user = req.session.user;
        const userDTO = new UserDTO(user);
        return res.send(userDTO);
    } catch (error) {
        res.status(500).send("No se pudo obtener información del usuario actual. Mensaje de error: " + error);
    }
}

export async function resetPassword(req, res) {
    const { email, password } = req.body;

    try {
        const user = await userService.getUserByEmail(email);

        if (validatePassword(password, user)) {

            return res.status(400).json({ message: "La nueva contraseña debe ser diferente de la contraseña actual." });
        }

        const hashedPassword = createHash(password);

        await userService.updateUserPassword(user._id, hashedPassword);

        return res.status(200).json({ message: "Contraseña restablecida correctamente." });
    } catch (error) {
        console.error("Error al restablecer la contraseña:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
}
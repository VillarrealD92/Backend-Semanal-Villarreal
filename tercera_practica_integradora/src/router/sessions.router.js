import { Router } from "express"
import passport from "passport"
import { current, github, githubCallback, login, logout, register } from "../controllers/sessions.controller.js"

const router = Router() 

router.post("/login", passport.authenticate("login", {failureRedirect:"/"}) , login)

router.get("/github", passport.authenticate("github", { scope: ["user:email"] } ), github)


router.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), githubCallback)

router.post("/register", passport.authenticate("register", {failureRedirect:"/register"}), register)

router.get("/logout", logout)

router.get("/current", current)

export default router

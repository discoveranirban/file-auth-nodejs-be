const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/user");

const {
    validateName,
    validateEmail,
    validatePassword,
} = require("../utils/validators");

router.post("/signup", async (req, res) => {
    try {
        const {name, email, password, isSeller} = req.body;

        const existingUser = await User.findOne({ where: {email}});

        if(existingUser){
            return res.status(403).json({ err: "User exists"});
        }

        if(!validateName(name) || !validateEmail(email) || !validatePassword(password)){
            return res.status(403).json({ err: "Validation failed"});
        }

        const hashedPass = await bcrypt.hash(password, (saltOrRounds = 10));

        const user = {
            email,
            name,
            isSeller,
            password: hashedPass
        }

        const createdUser = await User.create(user);

        return res.status(201).json({
            message: `Welcome ${createdUser.name}`
        })

    } catch (e) {
        return res.status(500).send(e);
    }
})

router.post("/signin", async (req, res) => {
    try {
        const {email, password } = req.body;

        if(!validateEmail(email) || !validatePassword(password)){
            return res.status(403).json({ err: "Validation failed"});
        }

        const existingUser = await User.findOne({ where: {email}});

        if(!existingUser){
            return res.status(404).json({ err: "User not found"});
        }

        const passwordCheck = await bcrypt.compare(password, existingUser.password);

        if(!passwordCheck){
            return res.status(404).json({ err: "email/password mismatch"});
        }

        const payload = { user: { id: existingUser.id }};
        const bearerToken = await jwt.sign(payload, "SECRET", {
            expiresIn: 360000,
        });

        res.cookie('t', bearerToken, { expire: new Date() + 9999 });
        
        return res.status(200).json({
            bearerToken
        })

    } catch (e) {
        return res.status(500).send(e);
    }
})

router.get("/signout", (req, res) => {
    try {
        res.clearCookie('t');
        return res.status(200).json({ message: "success" });
    } catch(e) {
        return res.status(500).send(e);
    }
})

module.exports = router;
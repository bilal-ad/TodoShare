const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const router = express.Router();



router.post('/registrieren', async (req, res) => {
    const {email,password} = req.body;

    if( !email || !password) {
        return res.status(400).json({message: "Email und Passwort sind erforderlich"});
    }

    try {
        const exist = await User.findOne({email});

        if (exist) {
            return res.status(400).json({message: "Email ist bereits registriert!"});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
          id: Date.now().toString(),
          email,
          passwordHash
    });

    await newUser.save();

    return res.status(201).json({message: "User registriert"});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Serverfehler bei Regestrierung"});
    }


});




router.post('/login', async (req, res) => {
    const {email, password} = req.body;

   try {
    const user = await User.findOne({email});

    if(!user) {
        return res.status(400).json({message: "Ungültige Email oder Passwort"})
    }

    const passwordPrüfen = await bcrypt.compare(password, user.passwordHash)
    if(!passwordPrüfen) {
        return res.status(400).json({message: "Ungültige Email oder Passwort"});
    }

    const token = jwt.sign(
        {id: user.id, email: user.email},
        'Geheimer-Token',
        {expiresIn: '7d'}
    );

    return res.status(200).json({token, user: {id: user.id, email: user.email}
    });
   } catch (err) {
    console.error(err);
    return res.status(500).json({message: "Serverfehler bei Login"});
   }
});




module.exports = router;
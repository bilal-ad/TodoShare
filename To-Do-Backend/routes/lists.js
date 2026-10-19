const express = require('express');
const router = express.Router();
const List = require('../models/list');
const User = require('../models/user');

router.get('/', async (req,res) => {
  try {
    const lists = await List.find();
    res.status(200).json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Serverfehler beim Laden der Listen"});
  }
    
});

router.get('/:slug', async (req,res) => {
  try {
    const list = await List.findOne({slug: req.params.slug});
    if(!list) {
        return res.status(404).json({message: "Liste nicht gefunden!"});
    }
    return res.status(200).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Serverfehler beim Laden der Liste"});
  }
});

router.post('/', async (req, res) => {
  const { name, slug } = req.body;

   if (!name || !slug) {
    return res
      .status(400)
      .json({ message: "Name und Slug sind erforderlich" });
  }

  try {
    const exist = await List.findOne({slug});
    if (exist) {
        return res.status(400).json({message: "Slug ist bereits vergeben"});
    }

    const neueListe = new List({
        name,
        slug,
        todos: [],
        sharedWith: []
    });

    await neueListe.save();

    return res.status(201).json(neueListe);
} catch (err) {
    console.error(err);
    res.status(500).json({message: "Serverfehler beim Erstellen der Liste"});
}
});

router.post('/:slug/share', async (req,res) => {
    const {slug} = req.params;
    const {email} = req.body;

    if (!email || !email.trim()) {
        return res.status(400).json({message: 'Email ist erforderlich'})
    }

    const normaleEmail = email.trim().toString();

    try {
        const list = await List.findOne({slug});  
        if (!list) {
          return res.status(404).json({message: 'Liste wurde nicht gefunden'})
        }

        const user = await User.findOne({ email: normaleEmail });
    if (!user) {
      return res.status(404).json({ message: 'User mit dieser Email existiert nicht' });
    }

     if(list.sharedWith.includes(normaleEmail)) {
         return res.status(400).json({message: 'Liste mit dieser Email bereits geteilt'});
     }

    list.sharedWith.push(normaleEmail);

    await list.save();

    return res.status(200).json({
        message: `Liste wurde mit ${normaleEmail} geteilt`, 
        sharedWith: list.sharedWith
    });    
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Serverfehler beim Teilen der Liste'});
    }
});

router.delete('/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const list = await List.findOne({ slug });

    if (!list) {
      return res.status(404).json({ message: 'Liste nicht gefunden!' });
    }

    await list.deleteOne();

    return res.status(200).json({ message: 'Liste wurde gelöscht' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Serverfehler beim Löschen der Liste' });
  }
});

module.exports = router;

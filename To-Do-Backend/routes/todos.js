const express = require('express');
const router = express.Router();
const List = require('../models/list');


router.post('/:slug/todos', async (req,res) => {
    const {slug} = req.params;
    const { titel, beschreibung, kategorie } = req.body;
   

    try {
        const list = await List.findOne({slug});

        if(!list) {
        return res.status(404).json({message: 'Liste nicht gefunden!'})
        }

        if (!titel || titel.trim() === "") {
        return res.status(400).json({ message: "Titel ist erforderlich" });
        }  

        const neuesToDo = {
          titel,
          beschreibung,
          kategorie,
        };

    list.todos.push(neuesToDo);
    await list.save();

    const added= list.todos[list.todos.length -1];

    return res.status(201).json(added);
    }

    catch (err) {
        console.error(err);
        res.status(500).json({message: "Serverfehler beim Erstellen des ToDos"});
    }
});

router.get("/:slug/todos/:id", async (req, res) => {
  const { slug, id } = req.params;

  try {
    const list = await List.findOne({ slug });
    if (!list) return res.status(404).json({ message: "Liste nicht gefunden!" });

    const todo = list.todos.id(id);
    if (!todo) return res.status(404).json({ message: "ToDo nicht gefunden!" });

    return res.status(200).json(todo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Serverfehler beim Laden des ToDo" });
  }
});

router.put('/:slug/todos/:id', async (req,res) => {
    const {slug, id} = req.params;
    const {titel, beschreibung, kategorie} = req.body;

    try {
        const list = await List.findOne({slug});

        if(!list) {
          return res.status(404).json({message: 'Liste nicht gefunden!'})
        }

        const todo = list.todos.id(id);

        if(!todo) {
          return res.status(404).json({message: 'ToDo nicht gefunden!'})
        }

        if (titel !== undefined) {
          todo.titel = titel;
        }

        if (beschreibung !== undefined) {
          todo.beschreibung = beschreibung;
       }
        if (kategorie !== undefined) {
          todo.kategorie = kategorie;
        }

    await list.save();

    return res.status(200).json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Serverfehler beim Aktualisieren des ToDos'});
    }
});

router.delete('/:slug/todos/:id', async (req,res) => {
    const {slug, id} = req.params;  

    try {
        const list = await List.findOne({slug});
    
    if(!list) {
        return res.status(404).json({message: 'Liste nicht gefunden!'})
    }

   const todo = list.todos.id(id);

   if(!todo) {
        return res.status(404).json({message: 'ToDo nicht gefunden!'})
    }
   
    todo.deleteOne();
    await list.save();

   return res.status(200).json({message: 'ToDo wurde gelöscht'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Serverfehler beim Löschen des ToDos'});
    }

});











module.exports = router;
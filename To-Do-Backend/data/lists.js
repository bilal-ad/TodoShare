let lists = [
    {
      id: "1",
      name: "Einkaufsliste",
      slug: "einkaufsliste",
      todos: [
        { id: 1, titel: "Milch kaufen", beschreibung: "2 Liter Vollmilch" },
        { id: 2, titel: "Brot kaufen", beschreibung: "Vollkornbrot" },
      ],
      sharedWith: []
    },
    {
      id: "2",
      name: "Hausaufgaben",
      slug: "hausaufgaben",
      todos: [{ id: 3, titel: "Mathe üben", beschreibung: "Seite 15" }],
      sharedWith: []
    },
  ];

  module.exports = {lists};
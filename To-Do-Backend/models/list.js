const e = require("express");
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    titel: { type: String, required: true },
    beschreibung: { type: String, default: "" },
    kategorie: { type: String, default: "Sonstiges" },
  },
  { timestamps: true }
);

const listSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    todos: {type:[todoSchema], default: []},
    sharedWith: {type:[String], default: []},
  },
  { timestamps: true }
);

module.exports = mongoose.model("List", listSchema);
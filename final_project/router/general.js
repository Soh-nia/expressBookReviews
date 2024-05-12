let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const express = require("express");
const axios = require("axios");
const public_users = express.Router();

public_users.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    try {
      const response = await axios.post(
        "http://localhost:5000/customer/register",
        {
          username: username,
          password: password,
        }
      );
      return res.status(200).json({ message: response.data.message });
    } catch (error) {
      return res
        .status(error.response.status)
        .json({ message: error.response.data.message });
    }
  }
  return res
    .status(400)
    .json({ message: "Username and password are required." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/customer/books");
    res.send(response.data);
  } catch (error) {
    res
      .status(error.response.status)
      .json({ message: error.response.data.message });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(
      `http://localhost:5000/customer/books/isbn/${isbn}`
    );
    res.send(response.data);
  } catch (error) {
    res
      .status(error.response.status)
      .json({ message: error.response.data.message });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  let author = req.params.author;
  author = author.replace(/_/g, " ");
  try {
    const response = await axios.get(
      `http://localhost:5000/customer/books/author/${author}`
    );
    res.send(response.data);
  } catch (error) {
    res
      .status(error.response.status)
      .json({ message: error.response.data.message });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  let title = req.params.title;
  author = title.replace(/_/g, " ");
  try {
    const response = await axios.get(
      `http://localhost:5000/customer/books/title/${title}`
    );
    res.send(response.data);
  } catch (error) {
    res
      .status(error.response.status)
      .json({ message: error.response.data.message });
  }
});

// Get book review
public_users.get("/review/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(
      `http://localhost:5000/customer/books/review/${isbn}`
    );
    res.send(response.data);
  } catch (error) {
    res
      .status(error.response.status)
      .json({ message: error.response.data.message });
  }
});

module.exports.general = public_users;

const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return !!user;
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        username: username,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res
      .status(200)
      .json({ message: "User successfully logged in", accessToken });
  } else {
    return res
      .status(401)
      .json({ message: "Invalid login. Check username and password" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  // if (!isbn || !review) {
  //   return res.status(400).json({ message: "ISBN and review are required" });
  // }

  // Find the book with the given ISBN
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has already posted a review for this book
  if (book.reviews[username]) {
    // Modify the existing review
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review modified successfully" });
  } else {
    // Add a new review
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review added successfully" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  // Check if the book with the given ISBN exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the logged-in user has posted a review for this book
  if (book.reviews[username]) {
    // Delete the review associated with the logged-in user
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

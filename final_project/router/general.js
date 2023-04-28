const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length > 0 && password.length > 0) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered!" });
    } else {
      return res
        .status(406)
        .json({ message: "Unable to register user: User already exists!" });
    }
  }
  return res.status(406).json({
    message: "Unable to register user: No username and/or password provided.",
  });
});

public_users.get("/", function (req, res) {
  res.send(JSON.stringify({ books }, null, 4));
});

public_users.get("/async", function (req, res) {
  const getBooks = new Promise(() => {
    res.send(JSON.stringify({ books }));
  });

  getBooks.then(() => console.log("Promise resolved."));
});

public_users.get("/isbn/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;
  res.send(books[bookISBN]);
});

public_users.get("/async/isbn/:isbn", function (req, res) {
  const getBook = new Promise(() => {
    const bookISBN = req.params.isbn;
    res.send(books[bookISBN]);
  });

  getBook.then(() => console.log("Promise resolved."));
});

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const allBooksByAuthor = Object.entries(books);
  const finalBooks = [];

  for (const [key, value] of allBooksByAuthor) {
    if (value.author === author) {
      finalBooks.push(value);
    }
  }
  res.send(finalBooks);
});

public_users.get("/async/author/:author", function (req, res) {
  const getAuthorsBooks = new Promise(() => {
    const author = req.params.author;

    const allBooksByAuthor = Object.entries(books);
    const finalBooks = [];

    for (const [key, value] of allBooksByAuthor) {
      if (value.author === author) {
        finalBooks.push(value);
      }
    }
    res.send(finalBooks);
  });

  getAuthorsBooks.then(() => console.log("Promise resolved."));
});

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  // Get all keys.
  const allBooksByTitle = Object.entries(books);
  const finalBooks = [];

  for (const [key, value] of allBooksByTitle) {
    if (value.title === title) {
      finalBooks.push(value);
    }
  }
  res.send(finalBooks);
});

public_users.get("/async/title/:title", function (req, res) {
  const getBookTitles = new Promise(() => {
    const title = req.params.title;

    const allBooksByTitle = Object.entries(books);
    const finalBooks = [];

    for (const [key, value] of allBooksByTitle) {
      if (value.title === title) {
        finalBooks.push(value);
      }
    }
    res.send(finalBooks);
  });

  getBookTitles.then(() => console.log("Promise resolved."));
});

public_users.get("/review/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;
  const book = books[bookISBN];

  res.send(book.reviews);
});

module.exports.general = public_users;

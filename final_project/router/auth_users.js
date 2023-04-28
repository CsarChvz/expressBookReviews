const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let matchingUsers = users.filter((user) => {
    return user.username === username;
  });
  if (matchingUsers.length > 0) {
    return false;
  }
  return true;
};

const authenticatedUser = (username, password) => {
  let matchingUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (matchingUsers.length > 0) {
    return true;
  }
  return false;
};

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).send("There was an issue while trying to log in.");
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        pw: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    // Create the user's session.
    req.session.authenticated = {
      accessToken,
      username,
    };

    return res.status(200).send("User successfully logged in.");
  } else {
    return res
      .status(208)
      .send("The provided username or password was not valid.");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn/:review", (req, res) => {
  const bookISBN = req.params.isbn;
  const userReview = req.params.review;

  const currentUser = req.session.authenticated.username;

  let bookReviews = books[bookISBN].reviews;

  let reviewExists = false;
  for (const username in bookReviews) {
    if (username === currentUser) {
      bookReviews[currentUser] = userReview;
      reviewExists = true;
      break;
    }
  }

  if (!reviewExists) {
    bookReviews[currentUser] = userReview;
  }

  res.send("The user's review has been added/updated successfully.");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const bookISBN = req.params.isbn;

  const currentUser = req.session.authenticated.username;

  const bookReviews = books[bookISBN].reviews;

  let reviewExists = false;
  for (const username in bookReviews) {
    if (username === currentUser) {
      delete bookReviews[currentUser];
      reviewExists = true;
      break;
    }
  }

  if (!reviewExists) {
    res.send("The review could not be deleted.");
  }
  res.send("The review was deleted successfully.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

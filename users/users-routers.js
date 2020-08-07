const express = require("express");
const users = require("./users-model");
//creates a standalone "mini" express application
//we can merge with main one in index.js

const router = express.Router();

router.get("/users", (req, res) => {
  users
    .find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the users",
      });
    });
});

router.get("/users/:id", (req, res) => {
  users
    .findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the user",
      });
    });
});

router.post("/users", (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({
      message: "Missing user name or email",
    });
  }

  users
    .add(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the user",
      });
    });
});

router.put("/users/:id", (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({
      message: "Missing user name or email",
    });
  }

  users
    .update(req.params.id, req.body)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "The user could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error updating the user",
      });
    });
});

router.delete("/users/:id", (req, res) => {
  users
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "The user has been nuked",
        });
      } else {
        res.status(404).json({
          message: "The user could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the user",
      });
    });
});

router.get("/users/:id/posts", (req, res) => {
  //these model return a promise, so we have to wait for
  //the promis to resolve with './then' or reject with '.catch'
  users
    .findUserPosts(req.params.id) //id coming from URL
    .then((posts) => {
      res.json(posts);
      //dont have to check to make sure 'posts'
      // exist be cause it could be an empty array and thats ok
    })
    .catch((err) => {
      //log this err and send back generic error response. since not sure what went wrong
      console.log(err);
      res.status(500).json({ message: "Could not get user posts" });
    });
});
//create endpoint that returns a single post for a user
router.get("/users/userID/posts/postID", (req, res) => {
  users
    .findUserPostsById(req.params.userID, req.params.postID)
    .then((post) => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({
          message: "post was not found for that user",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "could not get user post",
      });
    });
});
// 'require' and 'module.exports' is using a method //called commandJS which is an older way of doing //modules like in React (import/export)
module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");

router.get("/", (req, res) => {
    res.send("hello from base url");
  });
// one user can have many videos
// user post request for user data only and empty video list
// user put for videos array

// user id is the email of user
router.get('/user/:userId', (req, res)=>{
    User.findOne({email: req.params.userId})
    .populate('mintedVideos')
    .then(savedUser=> res.json(savedUser))
    .catch(err=>{
        return res.status(404).json({error: err})
    })
   
})

router.post("/addUser", (req, res) => {
    console.log(req.body+"This is")
    const { name, email , channelImageUrl} = req.body;
  
    if (!email || !name || !channelImageUrl) {
      res.status(422).json({ error: "Please add all the fields" });
    }
    User.findOne({ email: email })
      .then((savedUser) => {
        if (savedUser) {
          res.status(422).json({ error: "User already exists" });
        }
        else{
            const user = new User({
                name: name,
                email: email,
                channelImageUrl: channelImageUrl
              });

            user
            .save()
            .then((user) => {
              res.json({ message: "User saved successfully" });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => console.log(error));
  });
  

module.exports = router;
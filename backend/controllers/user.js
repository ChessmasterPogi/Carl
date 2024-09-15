const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");
const {errorHandler} = require("../auth");

module.exports.registerUser = (req, res) => {
   const {firstName,lastName,email,password} =req.body;
   console.log(`Name: ${firstName} ${lastName}, Email: ${email}`);
   res.status(200).send({
    message: "Registered successfully", 
    firstName: firstName, 
    lastName: lastName,
    email: email})
  };


  module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
      .then((user) => {
        if (!user) {
          // if the user has invalid token, send a message 'invalid signature'.
          return res.status(403).send({ message: "invalid signature" });
        } else {
          // if the user is found, return the user.
          user.password = "";
          return res.status(200).send(user);
        }
      })
      .catch((error) => errorHandler(error, req, res));
  };
  


  module.exports.loginUser = (req, res) => {
    // The "findOne" method returns the first record in the collection that matches the search criteria
    // We use the "findOne" method instead of the "find" method which returns all records that match the search criteria
    if (req.body.email.includes("@")) {
      return User.findOne({ email: req.body.email })
        .then((result) => {
          //User does not exist, return false
          if (result == null) {
            // Send status 404
            return res.status(404).send({ message: "No email found" });
  
            //User exists
          } else {
            //Create the variable "isPasswordCorrect" to return the resulf of comparing the login form password and the database password
            // The "compareSync" method is used to compare a non encrypted password from the login form (req.body) to the encrypted password retrieved from the database, this returns "true" or "false" value depending on the comparisopn
            // A good coding practice for the boolean variable/constants is to use the "is" or "are" at the beginning in the form of is + Noun
            // example. isSing, isDone, isAdmin, areDone etc.
            const isPasswordCorrect = bcrypt.compareSync(
              req.body.password,
              result.password
            );
  
            // If the passwords match/result of the above code is true
            if (isPasswordCorrect) {
              //Generate an access token
              //Uses the "createAccessToken" method defined in our "auth.js" file
              // Returning an object back to client application is common practice just for us to ensure information is properly labled and real world examples normally return more complex information represented by objects
  
              // Send status 200
              return res.status(200).send({
                message: "User logged in successfully",
                access: auth.createAccessToken(result),
              });
  
              //Passwords do not match simply return the boolean value of false.
            } else {
              // Send status 401
              return res
                .status(401)
                .send({ message: "Incorrect email or password" });
            }
          }
        })
        .catch((error) => errorHandler(error, req, res));
    } else {
      return res.status(400).send({ message: "Invalid email format" });
    }
  };
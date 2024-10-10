const rolesAvailable = require('../Constraints/roles')

//An middleware to check if the user trying to access is either itself or admin

const checkCurrentUser = (req, res, next) => {
      console.log(req.user);
      if (req.user._id.toString() !== req.params.id  || req.user.role !== rolesAvailable.admin) {
        return res.status(403).send("Access Denied!");
      }
      next();
    };
  
  module.exports = checkCurrentUser;
  
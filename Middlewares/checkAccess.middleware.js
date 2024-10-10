const checkAccess = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(403).send("Access Denied! Only user with valid access level can access this resource")
        }
        next()
    }
}

module.exports = checkAccess
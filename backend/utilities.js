// Middleware

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']; // get the token from the header if present
  // explain const token = authHeader && authHeader.split(" ")[1];
  
  const token = authHeader && authHeader.split(" ")[1];
  if(!token) return res.status(401).send({error: 'You are not authorized to access this route.'}) // check for authorization header and send error message back to client if no auth header is found in request headers object (req.headers)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).send({error: 'You are not authorized to access this route.'})
    req.user = user;
    next();
  })

}

module.exports = {
  authenticateToken
}
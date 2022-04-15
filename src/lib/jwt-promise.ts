import jwt from "jsonwebtoken"

const verify = function(token,key) {
  return new Promise((resolve, reject) => {
    jwt.verify(token,key, { algorithms: ['RS256'] }, (err,decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

export { verify }

module.exports = function(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      next(err);
    }
  };
}

// global try catch block for all request.. 
//just pass this function in the route handler 
//function and request error will got caught with this middleware
//NOTE:this middleware is alternative to express-async-erros. you can also use this library
// instead of this middleware

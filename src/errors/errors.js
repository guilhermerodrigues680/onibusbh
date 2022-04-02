// https://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax-babel/32749533

class ExtendableError extends Error {
  constructor(message, originalError = undefined) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
    this.originalError = originalError;
  }
}

class UnknownError extends ExtendableError {}
class NetworkError extends ExtendableError {}
class NetworkTimeoutError extends ExtendableError {}
class BadRequestError extends ExtendableError {}
class UnauthorizedError extends ExtendableError {}
class NotFoundError extends ExtendableError {}
class ConflictError extends ExtendableError {}
class UnprocessableEntityError extends ExtendableError {}
class InternalServerError extends ExtendableError {}

// class MyError extends ExtendableError {}
// let myerror = new MyError("ll");
// console.log(myerror.message);
// console.log(myerror instanceof MyError);
// console.log(myerror instanceof Error);
// console.log(myerror.name);
// console.log(myerror.stack);

export {
  NetworkError,
  UnknownError,
  NetworkTimeoutError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  InternalServerError
};

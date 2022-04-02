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
// class NetworkError extends ExtendableError {}
// class NetworkTimeoutError extends ExtendableError {}
class BadRequestError extends ExtendableError {}
// class UnauthorizedError extends ExtendableError {}
class NotFoundError extends ExtendableError {}
// class ConflictError extends ExtendableError {}
// class UnprocessableEntityError extends ExtendableError {}
class InternalServerError extends ExtendableError {}
class BadGatewayError extends ExtendableError {}

// class MyError extends ExtendableError {}
// let myerror = new MyError("ll");
// console.log(myerror.message);
// console.log(myerror instanceof MyError);
// console.log(myerror instanceof Error);
// console.log(myerror.name);
// console.log(myerror.stack);

// /**
//  * typifyTheError recebe um erro qualquer e o transforma em um erro
//  * conhecido pelo sistema
//  * @param {any} error
//  * @returns
//  */
// function typifyTheError(error) {
//   // apiErrorMsg fail, error ou null
//   let apiErrorMsg =
//     error?.response?.data?.data?.msg || error?.response?.data?.message || null;

//   if (!error.response) {
//     if (error?.code === "ECONNABORTED") {
//       const message =
//         "Erro, o servidor não respondeu no tempo esperado. Tente novamente mais tarde.";
//       return new NetworkTimeoutError(message, error);
//     } else {
//       const message =
//         "Erro, não é possível conectar com o servidor. Cheque sua conexão com a internet ou tente novamente mais tarde.";
//       return new NetworkError(message, error);
//     }
//   }

//   switch (error?.response?.status) {
//     case 400: {
//       const message = apiErrorMsg || "Erro nos dados enviados.";
//       return new BadRequestError(message, error);
//     }
//     case 401: {
//       const message =
//         apiErrorMsg ||
//         "Erro, você precisa estar logado para acessar esta página.";
//       return new UnauthorizedError(message, error);
//     }
//     case 404: {
//       const message =
//         apiErrorMsg || "Erro, o recurso que você procura não foi encontrado.";
//       return new NotFoundError(message, error);
//     }
//     case 409: {
//       const message =
//         apiErrorMsg ||
//         "Erro, os dados enviados estão em conflito com o recurso que está no servidor.";
//       return new ConflictError(message, error);
//     }
//     case 422: {
//       const message =
//         apiErrorMsg ||
//         "Erro, o servidor entendeu sua solicitação mas não foi capaz de processar a instrução.";
//       return new UnprocessableEntityError(message, error);
//     }
//     case 500: {
//       const message =
//         apiErrorMsg || "Erro, o servidor está com problemas internos.";
//       return new InternalServerError(message, error);
//     }
//     default:
//       return new UnknownError(error.message, error);
//   }
// }

export default {
  // typifyTheError,
  // NetworkError,
  UnknownError,
  // NetworkTimeoutError,
  BadRequestError,
  // UnauthorizedError,
  NotFoundError,
  // ConflictError,
  // UnprocessableEntityError,
  InternalServerError,
  BadGatewayError
};

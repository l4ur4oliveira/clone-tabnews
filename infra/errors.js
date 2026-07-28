export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Unexpected internal error ocurred.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contact the support team or try again later.";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

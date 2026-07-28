export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Unexpected internal error ocurred.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contact the support team or try again later.";
    this.statusCode = statusCode || 500;
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

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Service unavailable.", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Check the service status or try again later.";
    this.statusCode = 503;
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

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Method not allowed to this endpoint.");
    this.name = "MethodNotAllowedError";
    this.action = "Check the API documentation for the correct method to use.";
    this.statusCode = 405;
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

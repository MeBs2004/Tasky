const { HTTPSTATUS } = require("../config/http.config");
const { AppError } = require("../utils/appError");
const { ZodError } = require("zod");
const { ErrorCodeEnum } = require("../enums/error-code.enum");

const formatZodError = (res, error) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errors: errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
  });
};

const errorHandler = (error, req, res, next) => {
  console.error(`Error occured onPATH : ${req.path}`, error);

  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid JSON format. Please check you request body.",
    });
  }

  if (error instanceof ZodError) {
    return formatZodError(res, error);
  }
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    error: error?.message || "Unkown error occured",
  });
};

module.exports = {
  errorHandler,
};

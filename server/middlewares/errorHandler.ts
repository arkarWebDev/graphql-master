export default (controllerFunction: Function) =>
  (...args: unknown[]) => {
    return Promise.resolve(controllerFunction(...args)).catch((error) => {
      console.log(error.name);

      if (error.name === "CastError") {
        const message = `Data not found. field : ${error.path}`;
        throw message;
      }

      if (error.name === "ValidationError") {
        const message = Object.values(error.errors).map(
          (err: any) => err.message
        );
        const errorMessage = message.join(", ");
        throw errorMessage;
      }

      if (error.name === "MongoServerError") {
        const message = "Email is already exist.";
        throw message;
      }

      throw error;
    });
  };

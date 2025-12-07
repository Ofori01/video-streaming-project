

class CustomError extends Error{
    statusCode: number;
    errors: {message: string, field?: string}[] | undefined

    constructor(message : string = "Internal Server Error", statusCode: number = 500, errors?:{message: string, field?: string}[] ){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors
        Object.setPrototypeOf(this, CustomError.prototype);
    }

}

export default CustomError
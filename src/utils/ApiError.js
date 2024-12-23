class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong ",
        errors=[],
        stack="",
    )
    {
        super(message);
        this.statusCode=statusCode,
        this.message=message,
        this.data=null;
        this.success=false;
        this.errors=this.errors
        if (stack) {
            this.stack = stack;  // Use the provided stack trace
        } else {
            Error.captureStackTrace(this, this.constructor);  // Capture the stack trace automatically
        }
        
    }
}
export { ApiError};
import { Link } from "react-router-dom";


const ErrorComp = ({data = {}} ) => {
    const { message = "An error occurred", statusCode = 400 } = data;
    
  
    return (
      <>
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-600">{statusCode}</p>
            <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
              {message}
            </h1>
           
            <div className="mt-10 flex items-center justify-center gap-x-6">
             <Link 
             to="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
             >
                Go Back Home
             </Link>
             
            </div>
          </div>
        </main>
      </>
    );
  };
  
  export default ErrorComp;
  
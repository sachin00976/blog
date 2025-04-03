import axios from 'axios';
import { useState, useEffect } from 'react';

const useApiHandler = ({ url, method = 'get', body = {}, headers = {} }) => {
    console.log("Inside ap i handler");
    const [res, setRes] = useState(null);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoader(true);
                setError(null); // Clear previous errors

                const config = {
                    method,
                    url,
                    data: body, // Add body for POST, PATCH, etc.
                    
                };

                const response = await axios(config); // Use Axios with dynamic configuration
                console.log("res:",response)
                console.log("res.data:",response.data);
                console.log("res.data.data:",response.data.data);
                setRes(response.data);
                setData(response.data.data)
               
                 // Set fetched data
            } catch (err) {
                console.log("apiHandler error",error)
                setError({
                    statusCode: err.response?.status || 500,
                    message: err.message || "An unknown error occurred",
                    success: false,
                });
            } finally {
                setLoader(false);
            }
        };

        if (url) fetchData(); // Fetch only if the URL is provided
    }, []); // Re-run if any dependency changes

    return { res, data,error, loader };
};

export default useApiHandler;

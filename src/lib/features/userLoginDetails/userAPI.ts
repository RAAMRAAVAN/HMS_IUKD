
import axios from "axios";

// Define the base URL for the API
const API_BASE_URL = "http://192.168.1.32:5000/fetchUserDetails"; // Replace with your actual API base URL

// Define the function to fetch bed status based on the provided amount
export const getUser = async (userLoginID: string, Password: string) => {
  try {
    // Example GET request with a query parameter
    const response = await axios.post(`${API_BASE_URL}`, {userLoginID: userLoginID});
    return response;
  } catch (error) {
    // Handle the error appropriately (re-throw or log it)
    console.error("Error fetching bed status:", error);
    throw error;
  }
};
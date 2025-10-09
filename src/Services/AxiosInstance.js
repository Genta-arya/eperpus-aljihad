import { API } from "@/Constant/TableSyles";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: API,

  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosInstance;

import axios from "axios";
import axiosInstance from "../AxiosInstance";

export const createBuku = async (data) => {
  try {
    const response = await axiosInstance.post("/data/book", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBuku = async (type) => {
  try {
    const response = await axiosInstance.get("/data/book/" + type);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBuku = async (data) => {
  try {
    const response = await axiosInstance.put(`/data/book`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBuku = async (data) => {
  console.log(data);
  try {
    const response = await axiosInstance.delete("/data/book/", {
      data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchBook = async ({ keyword, type, page = 1, limit = 10 }) => {
  try {
    // endpoint sesuai backend: POST /book/search/:keyword
    const response = await axiosInstance.post(
      `/data/book/search/${keyword}`,
      { type },
      {
        params: { page, limit },
      }
    );
    return response.data; // data: { buku, pagination }
  } catch (error) {
    throw error;
  }
};
export const searchBooks = async ({ keyword, type, page = 1, limit = 10 }) => {
  try {
    // endpoint sesuai backend: POST /book/search/:keyword
    const response = await axiosInstance.post(
      `/data/books/search/${keyword}`,
      { type },
      {
        params: { page, limit },
      }
    );
    return response.data; // data: { buku, pagination }
  } catch (error) {
    throw error;
  }
};

export const countMasterData = async () => {
  try {
    const response = await axiosInstance.get("/data/metadata");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSingleBuku = async (data) => {
  try {
    const response = await axiosInstance.get(`/data/book/detail/${data}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

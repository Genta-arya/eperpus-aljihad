import axiosInstance from "../AxiosInstance";

export const getKategori = async () => {
  try {
    const response = await axiosInstance.get("/data/kategori");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createKategori = async (data) => {
  try {
    const response = await axiosInstance.post("/data/kategori", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editKategori = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/data/kategori/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteKategori = async (id) => {
  try {
    const response = await axiosInstance.delete(`/data/kategori/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

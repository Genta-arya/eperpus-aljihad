import axiosInstance from "@/Services/AxiosInstance";

export const getLembaga = async () => {
  try {
    const response = await axiosInstance.get("/data/lembaga");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createLembaga = async (data) => {
  try {
    const response = await axiosInstance.post("/data/lembaga", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editLembaga = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/data/lembaga/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteLembaga = async (id) => {
  try {
    const response = await axiosInstance.delete(`/data/lembaga/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

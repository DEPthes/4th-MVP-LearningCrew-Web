import axios from "axios";

const Token = localStorage.getItem("accessToken");

export const getImage = async (file_uuId: string) => {
 try {
  const response = await axios.get(`/api/files/images/${file_uuId}`, {
   responseType: "blob",
   headers: {
    Authorization: `Bearer ${Token}`,
   },
  });
  return URL.createObjectURL(response.data);
 } catch (error) {
  throw error;
 }
};

export const getFile = async (file_uuId: string) => {
 try {
  const response = await axios.get(`/api/files/downloads/${file_uuId}`, {
   responseType: "blob",
   headers: {
    Authorization: `Bearer ${Token}`,
   },
  });
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  return url;
 } catch (error) {
  throw error;
 }
};

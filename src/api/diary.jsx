import axiosInstance from "./axios";

export const getDiaries = async (year, month) => {
  const response = await axiosInstance.get(`/api/diary/get`, {
    params: { year, month },
  });
  return response.data;
};

export const writeDiary = async (diaryDto) => {
  const response = await axiosInstance.post(`/api/diary/write`, diaryDto);
  return response.data;
};

export const modifyDiary = async (diaryDto) => {
  const response = await axiosInstance.put(`/api/diary/modify`, diaryDto);
  return response.data;
};

export const deleteDiary = async (diaryDto) => {
  const response = await axiosInstance.delete(`/api/diary/delete`, {
    data: diaryDto,
  });
  return response.data;
};

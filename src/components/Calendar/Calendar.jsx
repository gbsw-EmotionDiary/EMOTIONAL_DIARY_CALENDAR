import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import styles from "./Calendar.module.css";
import {
  getDiaries,
  writeDiary,
  modifyDiary,
  deleteDiary,
} from "../../api/diary";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [diaryDto, setDiaryDto] = useState({
    date: "",
    title: "",
    content: "",
    emotion: 0,
  });
  const [diaries, setDiaries] = useState({});

  useEffect(() => {
    fetchDiaries();
  }, [currentDate]);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      const existingDiary = diaries[formattedDate] || {};
      setDiaryDto({
        date: formattedDate,
        title: existingDiary.title || "",
        content: existingDiary.content || "",
        emotion: existingDiary.emotion || 0,
      });
    }
  }, [selectedDate, diaries]);

  const fetchDiaries = async () => {
    try {
      const data = await getDiaries(
        currentDate.year(),
        currentDate.month() + 1
      );
      const diariesMap = {};
      data.forEach((diary) => {
        diariesMap[moment(diary.date).format("YYYY-MM-DD")] = diary;
      });
      setDiaries(diariesMap);
    } catch (error) {
      alert("일기를 가져오는 중 오류가 발생했습니다.");
    }
  };

  const handleDateClick = (day) => {
    const formattedDate = day.format("YYYY-MM-DD");
    setSelectedDate(day);
    setModalOpen(true);
  };

  const handleSaveDiary = async () => {
    try {
      if (diaries[diaryDto.date]) {
        await modifyDiary(diaryDto);
      } else {
        await writeDiary(diaryDto);
      }
      setModalOpen(false);
      fetchDiaries();
    } catch (error) {
      alert("일기 저장에 실패했습니다.");
    }
  };

  const handleDeleteDiary = async () => {
    try {
      await deleteDiary(diaryDto);
      setModalOpen(false);
      fetchDiaries();
    } catch (error) {
      alert("일기 삭제에 실패했습니다.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiaryDto((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmotionSelect = (emotion) => {
    setDiaryDto((prev) => ({ ...prev, emotion }));
  };

  const renderDays = () => {
    const startDay = currentDate.clone().startOf("month");
    const endDay = currentDate.clone().endOf("month");
    const days = [];

    for (let i = 0; i < startDay.day(); i++) {
      days.push(
        <div key={`empty-start-${i}`} className={styles.emptyDay}></div>
      );
    }

    let day = startDay.clone();
    while (day.isSameOrBefore(endDay)) {
      const clonedDay = day.clone();
      const isToday = clonedDay.isSame(moment(), "day");
      const isWeekend = clonedDay.day() === 0 || clonedDay.day() === 6;
      const formattedDate = clonedDay.format("YYYY-MM-DD");

      days.push(
        <div
          key={formattedDate}
          className={`${styles.day} ${isToday ? styles.today : ""} ${
            isWeekend ? styles.weekend : ""
          }`}
          onClick={() => handleDateClick(clonedDay)}
        >
          <span>{clonedDay.date()}</span>
          {diaries[formattedDate] && <div className={styles.hasDiary}></div>}
        </div>
      );
      day.add(1, "day");
    }

    for (let i = endDay.day(); i < 6; i++) {
      days.push(<div key={`empty-end-${i}`} className={styles.emptyDay}></div>);
    }

    return days;
  };

  const changeMonth = (delta) => {
    const newDate = currentDate.clone().add(delta, "month");
    setCurrentDate(newDate);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>캘린더</h2>
      </div>
      <div className={styles.calendarContainer}>
        <div className={styles.monthControl}>
          <button onClick={() => changeMonth(-1)}>이전 달</button>
          <h3 className={styles.monthYear}>
            {currentDate.format("YYYY년 M월")}
          </h3>
          <button onClick={() => changeMonth(1)}>다음 달</button>
        </div>
        <div className={styles.weekDays}>
          {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
            <div
              key={day}
              className={`${styles.weekDay} ${
                index === 0 || index === 6 ? styles.weekend : ""
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className={styles.daysGrid}>{renderDays()}</div>
      </div>
      {modalOpen && selectedDate && (
        <div className={styles.modal}>
          <h3>{selectedDate.format("YYYY년 M월 D일")}</h3>
          <input
            type="text"
            name="title"
            value={diaryDto.title}
            onChange={handleInputChange}
            placeholder="제목"
          />
          <textarea
            name="content"
            value={diaryDto.content}
            onChange={handleInputChange}
            placeholder="일기 내용을 입력하세요."
          />
          <div className={styles.emotionSelector}>
            {[1, 2, 3, 4, 5].map((emotion) => (
              <button
                key={emotion}
                onClick={() => handleEmotionSelect(emotion)}
                className={diaryDto.emotion === emotion ? styles.selected : ""}
              >
                {["😊", "😐", "😢", "😡", "😍"][emotion - 1]}
              </button>
            ))}
          </div>
          <button onClick={handleSaveDiary}>저장</button>
          {diaries[diaryDto.date] && (
            <button onClick={handleDeleteDiary}>삭제</button>
          )}
          <button onClick={() => setModalOpen(false)}>취소</button>
        </div>
      )}
    </div>
  );
}

export default Calendar;

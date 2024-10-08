import React from "react";

function NotFoundPage() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="container px-4">
        <h3 className="inline-block pr-5 mb-2 text-xl font-bold border-b">
          Oops!
        </h3>
        <p>없는 페이지 이거나 접속할 수 없습니다!</p>
        <p>
          <b>Wi-Fi에 접속</b>되어 있는지 확인하세요.
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;

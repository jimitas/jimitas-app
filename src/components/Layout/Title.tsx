import React from "react";

// ページタイトル表示用のコンポーネント
const Title = (props: { title: string }) => {
  return (
    <div id="content-title" className="mt-5 text-2xl md:text-3xl lg:text-4xl text-center font-bold">
      {props.title}
    </div>
  );
};

export default Title;

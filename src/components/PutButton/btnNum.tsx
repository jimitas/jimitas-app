import React from "react";

interface BtnNumProps {
  ITEM: number[];
  handleEvent: (num: number) => void;
}

export function BtnNum(props: BtnNumProps) {
  const { ITEM, handleEvent } = props;

  const handleClick = (num: number) => {
    handleEvent(num);
  };

  return (
    <div className="h-12 md:h-16 container flex justify-center items-center flex-wrap bg-orange-100">
      {ITEM.map((num) => (
        <button
          className="m-0.5 sm:m-1 p-1 font-bold
           w-7 sm:w-10 md:w-12 
           text-sm sm:text-base md:text-xl
          border-blue-700 bg-white border-2 text-blue-700  hover:bg-blue-700 hover:text-white active:translate-y-1 rounded-lg shadow-lg"
          onClick={() => handleClick(num)}
          key={num}
          value={num}
        >
          {num}
        </button>
      ))}
    </div>
  );
}
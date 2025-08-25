import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface BtnCheckProps {
  handleEvent: () => void;
  btnText?: string;
}

export function BtnCheck(props: BtnCheckProps) {
  const { handleEvent, btnText = "こたえあわせ" } = props;

  return (
    <div className="flex flex-wrap justify-center">
      <button
        onClick={handleEvent}
        className="flex justify-center item-center font-bold m-2 p-2 
                   w-32 md:w-36 text-sm md:text-base
                   border-red-300 bg-white border-2 text-red-400  hover:bg-red-500 hover:text-white active:translate-y-1 rounded-lg shadow-lg"
      >
        <FontAwesomeIcon icon={faCheck} className="w-4 h-4 md:w-6 md:h-6" />
        {btnText}
      </button>
    </div>
  );
}
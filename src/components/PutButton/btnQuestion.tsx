import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

interface BtnQuestionProps {
  handleEvent: () => void;
  btnText?: string;
}

export function BtnQuestion(props: BtnQuestionProps) {
  const { handleEvent, btnText = "もんだい" } = props;

  return (
    <div className="flex flex-wrap justify-center">
      <button
        onClick={handleEvent}
        className="flex justify-center item-center font-bold m-2 p-2 
                  w-24 md:w-32 text-sm md:text-base
                   border-red-300 bg-white border-2 text-red-400  hover:bg-red-500 hover:text-white active:translate-y-1 rounded-lg shadow-lg"
      >
        <FontAwesomeIcon icon={faQuestion} className="w-4 h-4 md:w-6 md:h-6" />
        {btnText}
      </button>
    </div>
  );
}
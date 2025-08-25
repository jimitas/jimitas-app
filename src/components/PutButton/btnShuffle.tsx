import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRandom } from "@fortawesome/free-solid-svg-icons";

interface BtnShuffleProps {
  handleEvent: () => void;
  btnText?: string;
}

export function BtnShuffle(props: BtnShuffleProps) {
  const { handleEvent, btnText = "しゃっふる" } = props;

  return (
    <div  className="flex flex-wrap justify-center">
      <button onClick={handleEvent} className="flex justify-center item-center font-bold m-2 p-2 
                   w-28 md:w-32 text-sm md:text-base
                   border-indigo-400 bg-white border-2 text-indigo-500  hover:bg-indigo-500 hover:text-white active:translate-y-1 rounded-lg shadow-lg">
        <FontAwesomeIcon icon={faRandom} className="w-4 h-4 md:w-6 md:h-6"/>
        {btnText}
      </button>
    </div>
  );
}

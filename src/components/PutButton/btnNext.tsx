import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface BtnNextProps {
  handleEvent: () => void;
}

export function BtnNext(props: BtnNextProps) {
  const { handleEvent } = props;

  return (
    <div className="flex flex-wrap justify-center">
      <button 
        className="flex justify-center item-center font-bold m-2 p-2 
                   w-10 md:w-12 text-sm md:text-base
                   border-green-400 bg-white border-2 text-green-500  hover:bg-green-500 hover:text-white active:translate-y-1 rounded-lg shadow-lg" 
        onClick={handleEvent}
      >
        <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 md:w-6 md:h-6"/>
      </button>
    </div>
  );
}

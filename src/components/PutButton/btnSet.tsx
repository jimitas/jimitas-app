import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faUserEdit } from "@fortawesome/free-solid-svg-icons";

interface BtnCheckProps {
  handleEvent: () => void;
  btnText?: string;
}

export function BtnSet(props: BtnCheckProps) {
  const { handleEvent } = props;

  return (
    <div className="flex flex-wrap justify-center">
      <button
        className="flex justify-center item-center font-bold m-2 p-2 
                   w-20 md:w-24 text-sm md:text-base
                   border-red-300 bg-white border-2 text-red-400  hover:bg-red-500 hover:text-white active:translate-y-1 rounded-lg shadow-lg"
        onClick={handleEvent}
      >
        <div className="flex">
          <FontAwesomeIcon icon={faUserEdit} className="w-4 h-4 md:w-6 md:h-6" />
          {"セット"}
        </div>
      </button>
    </div>
  );
}

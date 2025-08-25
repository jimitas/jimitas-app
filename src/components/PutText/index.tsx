import React, { RefObject } from "react";

interface PutTextProps {
  el_text: RefObject<HTMLDivElement>;
  text?: string;
}

export function PutText({ el_text, text }: PutTextProps) {
  return (
    <div className="w-full flex justify-center items-center">
      <div ref={el_text} className="container flex justify-center items-center h-12 my-3 p-3 text-black bg-yellow-100 text-xl md:text-2xl lg:text-3xl font-bold">
        {text}
      </div>
    </div>
  );
}

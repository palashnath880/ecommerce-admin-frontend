import React from "react";
import { ButtonProps } from "../../types";

export default function Button(props: ButtonProps) {
  return (
    <button
      className={`${props.className} text-sm font-medium disabled:bg-opacity-90 rounded-full bg-primary text-white py-3 shadow-primary shadow-lg`}
      disabled={props.disabled}
      type={props.type}
    >
      {props?.children}
    </button>
  );
}

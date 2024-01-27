import React from "react";
import { InputProps } from "../../types";

export default function TextInput(props: InputProps) {
  if (!props.Form) {
    return <></>;
  }

  const {
    register,
    formState: { errors },
  } = props.Form;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.name} className="text-sm font-medium">
        {props.label}
      </label>
      <input
        id={props.name}
        type={props.type}
        className={`px-4 py-2 border-2 rounded-md duration-200 font-medium w-full outline-none text-sm ${
          errors[props.name] && "border-red-500"
        }`}
        placeholder={props.placeholder}
        {...register(props.name, props.validation)}
      />
    </div>
  );
}

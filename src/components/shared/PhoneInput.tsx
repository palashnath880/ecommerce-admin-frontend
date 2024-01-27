import React from "react";
import { PhoneInputProps } from "../../types";

export default function PhoneInput(props: PhoneInputProps) {
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
      <div
        className={`flex border-2 rounded-md duration-200 font-medium overflow-hidden ${
          errors[props.name] && "border-red-500"
        }`}
      >
        <span className="px-2 text-sm font-medium flex items-center border-r-2">
          +880
        </span>
        <input
          type="tel"
          id={props.name}
          className={`px-4 py-2  w-full outline-none text-sm`}
          placeholder={props.placeholder}
          {...register(props.name, props.validation)}
        />
      </div>
    </div>
  );
}

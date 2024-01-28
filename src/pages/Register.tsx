import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../components/shared/TextInput";
import { PasswordValidationType, RegisterForm } from "../types";
import Button from "../components/shared/Button";
import { Link } from "react-router-dom";
import authApi from "../api/authApi";
import { useCookies } from "react-cookie";
import PhoneInput from "../components/shared/PhoneInput";
import { TiTick } from "react-icons/ti";
import parsePhoneNumber from "libphonenumber-js";
import { AxiosError } from "axios";

const PasswordValidation = ({ data }: { data: PasswordValidationType }) => {
  const arr = [
    {
      valid: data.lowercase,
      text: "At least one lowercase letter.",
    },
    {
      valid: data.uppercase,
      text: "At least one uppercase letter.",
    },
    {
      valid: data.oneDigit,
      text: "At least one digit.",
    },
    {
      valid: data.specialCharacter,
      text: "At least one special character.",
    },
    {
      valid: data.length,
      text: "Minimum length of 8 characters.",
    },
    {
      valid: data.matched,
      text: "Password matched.",
    },
  ];

  return (
    <ul className="space-y-2 pl-2">
      {arr.map(({ valid, text }, index) => (
        <li className="flex gap-1 text-xs font-medium items-center" key={index}>
          <span>
            <TiTick
              size={18}
              className={valid ? "text-green-500" : "text-gray-400"}
            />
          </span>
          {text}
        </li>
      ))}
    </ul>
  );
};

export default function Register() {
  // states
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [pwdValidation, setPwdValidation] = useState<PasswordValidationType>({
    lowercase: false,
    uppercase: false,
    oneDigit: false,
    specialCharacter: false,
    length: false,
    matched: false,
  });

  // react-cookie
  const [_cookies, setCookie] = useCookies(["auth_token"]);

  // react-hook-form
  const Form = useForm<RegisterForm>();
  const { handleSubmit, watch, setError: setFormError } = Form;

  // register handler
  const registerHandler: SubmitHandler<RegisterForm> = async (data) => {
    if (Object.values(pwdValidation).some((i) => !i)) {
      return;
    }

    const phoneNumber = parsePhoneNumber(data.phone, "BD");

    if (!phoneNumber?.isValid()) {
      // check phone number is valid
      setFormError("phone", { message: "invalid" });
      return;
    }

    const formattedNumber = phoneNumber?.formatNational(); // formatted number
    data.phone = formattedNumber;

    try {
      setSubmitting(true);
      setError(""); // clear error

      const res = await authApi.register(data); // send register request
      if (res.data.token) {
        // set cookie with expiration time
        setCookie("auth_token", res.data.token, {
          expires: new Date(Date.now() + 3600000 * 7), //3600000 milliseconds = 1 day
        });
        window.location.pathname = "/";
      }
    } catch (err) {
      interface ServerError {
        message: string;
      }

      const error = err as AxiosError<ServerError>;
      error?.response?.data?.message
        ? setError(error?.response?.data?.message)
        : setError(error?.response?.statusText);
    } finally {
      setSubmitting(false);
    }
  };

  // password check
  useEffect(() => {
    watch(({ confirm_password, password }, { name }) => {
      if (
        (name === "confirm_password" || name === "password") &&
        confirm_password &&
        password
      ) {
        setPwdValidation({
          lowercase: /[^a-z]/.test(confirm_password),
          uppercase: /[^A-Z]/.test(confirm_password),
          oneDigit: /\d/.test(confirm_password),
          specialCharacter: /(?=.*[^a-zA-Z0-9])/.test(confirm_password),
          length: /^.{8,32}$/.test(confirm_password),
          matched:
            confirm_password && password
              ? confirm_password === password
              : false,
        });
      }
    });
  }, [watch]);

  return (
    <div className="min-h-screen w-full grid place-items-center py-10">
      <div className="max-sm:w-[95%] sm:w-[400px] border rounded-lg shadow-xl">
        <div className="flex flex-col gap-5 py-5 px-5">
          <h1 className="text-center text-3xl font-bold">Register</h1>
          <form className="pb-7" onSubmit={handleSubmit(registerHandler)}>
            <div className="flex flex-col gap-3">
              <TextInput
                Form={Form}
                name="name"
                label="Full Name"
                type="text"
                placeholder="Enter full name here"
                validation={{ required: true }}
              />
              <TextInput
                Form={Form}
                name="email"
                label="Email"
                type="email"
                placeholder="Enter email here"
                validation={{
                  required: true,
                  pattern: {
                    value:
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: "invalid",
                  },
                }}
              />

              <PhoneInput
                Form={Form}
                name="phone"
                label="Phone Number"
                placeholder="Enter phone number without +880"
                validation={{ required: true }}
              />

              <TextInput
                Form={Form}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter password here"
                validation={{ required: true }}
              />

              <TextInput
                Form={Form}
                name="confirm_password"
                label="Confirm Password"
                type="password"
                placeholder="Enter confirm password here"
                validation={{ required: true }}
              />

              <PasswordValidation data={pwdValidation} />

              {/* form error message show */}
              {error && (
                <p className="text-center text-xs font-medium text-red-500">
                  {error}
                </p>
              )}

              <Button type="submit" className="!mt-2" disabled={submitting}>
                Register
              </Button>
              <p className="mt-4 text-center text-sm font-medium">
                You have an account{" "}
                <Link
                  to={"/login"}
                  className="underline hover:no-underline duration-200 font-bold"
                >
                  login
                </Link>{" "}
                here
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

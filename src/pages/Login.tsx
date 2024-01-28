import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../components/shared/TextInput";
import { LoginForm } from "../types";
import Button from "../components/shared/Button";
import { Link, useSearchParams } from "react-router-dom";
import authApi from "../api/authApi";
import { useCookies } from "react-cookie";
import { AxiosError } from "axios";
import { parsePhoneNumber } from "libphonenumber-js";

export default function Login() {
  // states
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [search] = useSearchParams();

  // react-cookie
  const [_cookies, setCookie] = useCookies(["auth_token"]);

  // react-hook-form
  const Form = useForm<LoginForm>();
  const { handleSubmit } = Form;

  // login handler
  const loginHandler: SubmitHandler<LoginForm> = async (data) => {
    try {
      setSubmitting(true);
      setError(""); // clear error

      // phone number check
      const phoneNumber = parsePhoneNumber(data.user_login, "BD");
      if (phoneNumber.isValid()) {
        const formattedNumber = phoneNumber.formatNational(); // formatted number
        data.user_login = formattedNumber;
      }

      const res = await authApi.login(data); // send login request
      if (res.data.token) {
        // set cookie with expiration time
        setCookie("auth_token", res.data.token, {
          expires: new Date(Date.now() + 3600000 * 7), //3600000 milliseconds = 1 day
        });
        if (search.get("redirect_url")) {
          window.location.replace(search.get("redirect_url"));
        } else {
          window.location.pathname = "/";
        }
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

  return (
    <div className="min-h-screen w-full grid place-items-center">
      <div className="max-sm:w-[95%] sm:w-[400px] border rounded-lg shadow-xl">
        <div className="flex flex-col gap-5 py-5 px-5">
          <h1 className="text-center text-3xl font-bold">Login</h1>
          <form className="pb-7" onSubmit={handleSubmit(loginHandler)}>
            <div className="flex flex-col gap-3">
              <TextInput
                Form={Form}
                name="user_login"
                label="Email or Phone"
                type="text"
                placeholder="Email or Phone Number"
                validation={{ required: true }}
              />
              <TextInput
                Form={Form}
                name="user_pass"
                label="Password"
                type="password"
                placeholder="Password"
                validation={{ required: true }}
              />
              {/* form error message show */}
              {error && (
                <p className="text-center text-xs font-medium text-red-500">
                  {error}
                </p>
              )}
              <Button type="submit" className="!mt-2" disabled={submitting}>
                Login
              </Button>
              <p className="mt-4 text-center text-sm font-medium">
                You don't have an account{" "}
                <Link
                  to={"/register"}
                  className="underline hover:no-underline duration-200 font-bold"
                >
                  register
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

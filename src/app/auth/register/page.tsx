"use client";

import { Button, Loader, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/network";
import toast, { Toaster } from "react-hot-toast";

interface IRegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IRegisterForm>();

  const registerHandler: SubmitHandler<IRegisterForm> = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/register`, {
        username: data.username,
        email: data.email,
        password: data.password,
        isValid: false,
      });

      router.replace("/auth/login?redirectFromRegister=true");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        toast.error(e.response?.data);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Toaster />
      <h1 className="text-3xl">Register</h1>
      <form
        onSubmit={handleSubmit(registerHandler)}
        className="mt-5 flex flex-col gap-y-2"
      >
        <TextInput
          {...register("username", {
            required: "Username is required",
            validate: {
              alphanumericOnly: (v) =>
                RegExp("^[a-zA-Z0-9_]+$").test(v) ||
                "Other special characters are not allowed",
            },
            onChange: (e) => {
              setValue("username", e.target.value.trim());
            },
          })}
          label="Username"
          description="Allowed special character: _ (underscore)"
          error={errors.username?.message}
        />
        <TextInput
          {...register("email", {
            validate: {
              required: (v) => v.length !== 0 || "Email is required",
              isEmail: (v) =>
                RegExp("@.*.ac(?:.[a-zA-Z]+)+$").test(v) ||
                "Please use your university email",
            },
            onChange: (e) => {
              setValue("email", e.target.value.trim());
            },
          })}
          label="Email"
          description="Use your university email"
          type="text"
          error={errors.email?.message}
        />
        <TextInput
          {...register("password", {
            validate: {
              required: (v) => v.length !== 0 || "Password is required",
              minCharacters: (v) => v.length >= 8 || "Password is too short",
            },
            onChange: (e) => {
              setValue("password", e.target.value.trim());
            },
          })}
          label="Password"
          type="password"
          error={errors.password?.message}
        />
        <TextInput
          {...register("confirmPassword", {
            validate: {
              required: (v) => v.length !== 0 || "Confirm password is required",
              matchPassword: (v) =>
                v === getValues("password") || "Password not match",
            },
            onChange: (e) => {
              setValue("confirmPassword", e.target.value.trim());
            },
          })}
          label="Confirm password"
          type="password"
          error={errors.confirmPassword?.message}
        />
        <div className="mt-5 w-full">
          <Button
            type="submit"
            className="bg-black w-full"
            disabled={loading ? true : false}
          >
            {loading ? <Loader color="white" size="sm" /> : "Submit"}
          </Button>
        </div>
      </form>
      <div className="text-center mt-10">
        <p className="text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-500 font-bold hover:cursor-pointer"
            onClick={() => router.push("/auth/login")}
          >
            Login Here
          </span>
        </p>
      </div>
    </>
  );
};

export default Register;

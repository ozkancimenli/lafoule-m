"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const defaultValues = {
  name: "",
  email: "",
  phone: "",
  details: "",
};

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ defaultValues });
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const onSubmit = async (data) => {
    try {
      setServerError("");
      setServerSuccess("");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          details: data.details || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "We could not send your message.");
      }

      setServerSuccess("Thanks for reaching out! I will get back to you shortly.");
      reset(defaultValues);
    } catch (error) {
      setServerError(error.message || "Unexpected error. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-12 text-base xs:text-lg sm:text-xl font-medium leading-relaxed font-in"
    >
      Hello! My name is{" "}
      <input
        type="text"
        placeholder="your name"
        {...register("name", {
          required: "Name is required",
          maxLength: { value: 120, message: "Keep it under 120 characters" },
        })}
        className="outline-none border-0 p-0 mx-2 focus:ring-0 placeholder:text-center placeholder:text-lg border-b border-gray focus:border-gray bg-transparent disabled:cursor-not-allowed"
        disabled={isSubmitting}
        aria-invalid={errors.name ? "true" : "false"}
      />
      and I want to discuss a potential project. You can email me at
      <input
        type="email"
        placeholder="your@email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i,
            message: "Please enter a valid email",
          },
        })}
        className="outline-none border-0 p-0 mx-2 focus:ring-0 placeholder:text-center placeholder:text-lg border-b border-gray focus:border-gray bg-transparent disabled:cursor-not-allowed"
        disabled={isSubmitting}
        aria-invalid={errors.email ? "true" : "false"}
      />
      or reach out to me on
      <input
        type="tel"
        placeholder="your phone"
        {...register("phone", {
          maxLength: { value: 30, message: "Phone number looks too long" },
        })}
        className="outline-none border-0 p-0 mx-2 focus:ring-0 placeholder:text-center placeholder:text-lg border-b border-gray focus:border-gray bg-transparent disabled:cursor-not-allowed"
        disabled={isSubmitting}
      />
      Here are some details about my project: <br />
      <textarea
        {...register("details", {
          maxLength: {
            value: 1500,
            message: "Keep the briefing under 1500 characters",
          },
        })}
        placeholder="My project is about..."
        rows={3}
        className="w-full outline-none border-0 p-0 mx-0 focus:ring-0 placeholder:text-lg border-b border-gray focus:border-gray bg-transparent disabled:cursor-not-allowed"
        disabled={isSubmitting}
      />
      <div className="mt-4 space-y-2 text-sm font-normal text-red-500">
        {errors.name && <p>{errors.name.message}</p>}
        {errors.email && <p>{errors.email.message}</p>}
        {errors.phone && <p>{errors.phone.message}</p>}
        {errors.details && <p>{errors.details.message}</p>}
        {serverError && <p>{serverError}</p>}
        {serverSuccess && (
          <p className="text-emerald-500">{serverSuccess}</p>
        )}
      </div>
      <button
        type="submit"
        className="mt-8 font-medium inline-block capitalize text-lg sm:text-xl py-2 sm:py-3 px-6 sm:px-8 border-2 border-solid border-dark dark:border-light rounded transition-colors duration-200 hover:bg-dark hover:text-light dark:hover:bg-light dark:hover:text-dark disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send request"}
      </button>
    </form>
  );
}

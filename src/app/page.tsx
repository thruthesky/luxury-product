"use client";
import { getMimeType, uploadImage } from "@/lib/firebase/firebase.functions";
import { useReducer } from "react";
import {
  initialState,
  reducer,
  setImageUrl,
  setProduct,
  setProgress,
} from "./page.reducer";
import Image from "next/image";
import { FileDataPart, getGenerativeModel } from "firebase/vertexai";
import { vertexAI } from "@/lib/firebase/clientApp";
import { PRODUCT_SCHEMA } from "@/config/schema";
import Spinner from "@/components/Spinner";

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function getProductDetails(url: string) {
    console.log("Getting product details for image URL:", url);
    const productModel = getGenerativeModel(vertexAI, {
      model: "gemini-2.0-flash",
      systemInstruction:
        "You are a product expert. You will be given an image of a product and you will return the details of the product.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: PRODUCT_SCHEMA,
      },
    });

    const result = await productModel.generateContent([
      `
      You are an AI Product Expert.
      You will be given an image of a product and you will return the facts details of the product.
      You will return the details in JSON format.
      You will return the details in the following format:
      {
        name: string,
        brand: string,
        company: string,
        year: number,
        price: number,
        currency: string,
        size: string,
        material: string,
        description: string,
        website: string,
      }
      You need to look for facts information of the product.
      You need to look for the name of the product.
      You need to look for the brand of the product.
      You need to look for the company of the product.
      You need to look for the year of the product was release.
      You need to look for the price of the product when it was release.
      You need to look for the size of the product.
      You need to look for the material of the product.
      You need to look for the description of the product.
      You need to look for the image URL of the product.
      Analyze the image and provide the details of the product in JSON format`,
      {
        fileData: {
          fileUri: url,
          mimeType: await getMimeType(url),
        },
      } as FileDataPart,
    ]);

    const response = result.response.text();
    console.log("Response:", response);
    dispatch(setProduct(JSON.parse(response)));
  }

  return (
    <section className="flex flex-col items-center justify-between gap-5">
      <header className="flex items-center justify-between w-full p-5 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Luxury Product</h1>
      </header>
      <div className="flex flex-col items-center justify-center  gap-5">
        <section className="flex flex-col items-center justify-center gap-5">
          <h2 className="text-xl font-bold">Upload an image</h2>
          <section className="relative overflow-hidden p-1 border-2 border-gray-300 rounded-lg shadow-md flex flex-col items-center justify-center min-w-52 min-h-52">
            <input
              className="absolute bottom-0 right-0 top-0 opacity-1 cursor-pointer text-9xl"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) =>
                uploadImage(e, {
                  onUpload: async (url) => {
                    console.log("Image uploaded to:", url);
                    dispatch(setImageUrl(url));
                    getProductDetails(url);
                  },
                  progress: (progress) => {
                    console.log("Upload progress:", progress);
                    dispatch(setProgress(progress));
                  },
                  deleteUrl: state.imageUrl,
                })
              }
            />
            {!state.imageUrl && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-32"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            )}
            {state.imageUrl && (
              <Image
                key={state.imageUrl}
                className="rounded-sm"
                src={state.imageUrl}
                alt="Product"
                width={256}
                height={256}
                style={{ width: "auto", height: "auto" }}
              />
            )}
          </section>
          {state.progress > 0 && (
            <section className="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500"
                style={{
                  width: (state.progress > 20 ? state.progress : 20) + "%",
                }}
              ></div>
            </section>
          )}
        </section>
        {!state.product && (
          <section className="flex flex-col items-center justify-center gap-5">
            <p className="text-gray-500">
              Upload luxury product like bag, wallet, watch, jewelry, etc.{" "}
            </p>
          </section>
        )}

        {state.loading && (
          <section className="flex flex-col items-center justify-center gap-5">
            <Spinner />
            <p>Loading product details...</p>
          </section>
        )}
        {state.product && !state.loading && (
          <div className="product-details px-20">
            <p>
              <strong>Product information</strong>
            </p>
            <p>name: {state.product?.name}</p>
            <p>brand: {state.product?.brand}</p>
            <p>company: {state.product?.company}</p>
            <p>year: {state.product?.year}</p>
            <p>
              price: {state.product?.currency} {state.product?.price}
            </p>
            <p>size: {state.product?.size}</p>
            <p>material: {state.product?.material}</p>
            <p>description: {state.product?.description}</p>
            <p>Website: {state.product?.website}</p>
          </div>
        )}
      </div>
    </section>
  );
}

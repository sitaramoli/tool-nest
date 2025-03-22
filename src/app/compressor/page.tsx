"use client";

import React, { useReducer } from "react";
import imageCompression from "browser-image-compression";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { calculateReduction, formatFileSize } from "@/utils/imageUtils";
import ImageState from "@/lib/types";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

type State = {
  originalImage: ImageState;
  compressedImage: ImageState;
  isLoading: boolean;
  error: string;
  compressionQuality: number;
};

type Action =
  | { type: "SET_ORIGINAL_IMAGE"; payload: ImageState }
  | { type: "SET_COMPRESSED_IMAGE"; payload: ImageState }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_COMPRESSION_QUALITY"; payload: number };

const ImageCompressor: React.FC = () => {
  const initialState: State = {
    originalImage: {
      dataUrl: "",
      file: null,
      name: "",
      size: 0,
    },
    compressedImage: {
      dataUrl: "",
      file: null,
      name: "",
      size: 0,
    },
    isLoading: false,
    error: "",
    compressionQuality: 80,
  };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "SET_ORIGINAL_IMAGE":
        return {
          ...state,
          originalImage: { ...action.payload },
        };
      case "SET_COMPRESSED_IMAGE":
        return {
          ...state,
          compressedImage: { ...action.payload },
        };
      case "SET_LOADING":
        return { ...state, isLoading: action.payload };
      case "SET_ERROR":
        return { ...state, error: action.payload };
      case "SET_COMPRESSION_QUALITY":
        return { ...state, compressionQuality: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { originalImage, compressedImage, error, compressionQuality } = state;

  const handleCompressionQualityChange = async (value: number[]) => {
    console.log(value[0]);
    dispatch({
      type: "SET_COMPRESSION_QUALITY",
      payload: value[0],
    });
    await handleRecompress();
  };

  const compressImage = async (file: File, quality: number) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: quality / 100,
    };

    const compressedFile = await imageCompression(file, options);
    const compressedDataUrl =
      await imageCompression.getDataUrlFromFile(compressedFile);

    dispatch({
      type: "SET_COMPRESSED_IMAGE",
      payload: {
        dataUrl: compressedDataUrl,
        file: compressedFile,
        name: `compressed_${file.name}`,
        size: compressedFile.size,
      },
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    dispatch({ type: "SET_ERROR", payload: "" });
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch({
          type: "SET_ORIGINAL_IMAGE",
          payload: {
            dataUrl: e.target?.result as string,
            file,
            name: file.name,
            size: file.size,
          },
        });
      };
      reader.readAsDataURL(file);
      await compressImage(file, compressionQuality);
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: "Error uploading image. Please try again.",
      });
      console.error(err);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleRecompress = async () => {
    if (!originalImage.file) return;

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await compressImage(originalImage.file, compressionQuality);
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: "Error recompressing image. Please try again.",
      });
      console.error(err);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleDownload = () => {
    if (!compressedImage.file) return;

    const link = document.createElement("a");
    link.download = compressedImage.name;
    link.href = compressedImage.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Image Compressor
        </h1>

        {/* Upload Section */}
        {!originalImage.dataUrl && (
          <div className="flex flex-col items-center justify-center h-96 border-4 border-dashed border-gray-300 rounded-xl mb-8 hover:border-gray-500 transition-colors">
            <label className="cursor-pointer flex flex-col items-center">
              <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mb-4" />
              <span className="text-lg text-gray-600">
                Click to upload image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Results Section */}
        {originalImage.dataUrl && compressedImage.dataUrl && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="mb-6">
                <h2 className="font-medium text-gray-900 mb-5">
                  Image: {originalImage.name}
                </h2>
                <hr className="mb-5" />
                <div className="flex flex-row justify-between text-gray-600">
                  <p className="font-bold">
                    Original: {formatFileSize(originalImage.size)}
                  </p>
                  <p className="font-bold">Quality: {compressionQuality}%</p>
                  <p className="font-bold">
                    Preview: {formatFileSize(compressedImage.size)} (
                    {calculateReduction(compressionQuality)}%)
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  defaultValue={[compressionQuality]}
                  onValueChange={(value) =>
                    handleCompressionQualityChange(value)
                  }
                />
                <Button className="mt-6 w-full" onClick={handleDownload}>
                  Download
                </Button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-center items-center">
              <img
                src={compressedImage.dataUrl}
                alt="Compressed preview"
                className="aspect-auto"
                style={{ height: "600px" }}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
export default ImageCompressor;

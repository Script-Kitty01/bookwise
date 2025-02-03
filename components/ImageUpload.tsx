"use client";
import React, { useRef, useState } from "react";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from "@/lib/config";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

interface UploadResponse {
  filePath: string;
}

interface ImageUploadProps {
  onFileChange: (filePath: string) => void;
}

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }
    const data = await response.json();
    const { signature, expire, token } = data;
    return { token, expire, signature };
  } catch (error) {
    throw new Error(
      `Authentication request failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

const ImageUpload = ({ onFileChange }: ImageUploadProps) => {
  const ikUploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<UploadResponse | null>(null);

  const onError = (error: Error) => {
    console.error("Upload error:", error);
    toast({
      title: "Upload Failed",
      description: "The image failed to upload. Please try again.",
      variant: "destructive",
    });
  };

  const onSuccess = (res: UploadResponse) => {
    setFile(res);
    onFileChange(res.filePath);
    toast({
      title: "Upload Successful",
      description: `Image uploaded successfully: ${res.filePath.split("/").pop()}`,
    });
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <div className="flex flex-col items-center gap-4">
        <IKUpload
          className="hidden"
          ref={ikUploadRef}
          onError={onError}
          onSuccess={onSuccess}
          fileName="test-upload.png"
        />
        <button
          className="upload-btn flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            ikUploadRef.current?.click();
          }}
        >
          <Image
            src="/icons/upload.svg"
            alt="Upload icon"
            width={20}
            height={20}
            className="object-contain"
          />
          <p className="text-base text-light-100">Upload a file</p>
        </button>

        {file && (
          <div className="mt-4">
            <p className="upload-filename mb-2 text-sm text-gray-600">
              {file.filePath}
            </p>
            <IKImage
              alt={`Uploaded image - ${file.filePath}`}
              path={file.filePath}
              width={500}
              height={500}
              className="rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </ImageKitProvider>
  );
};

export default ImageUpload;

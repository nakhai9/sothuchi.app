"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { useCallback, useMemo, useState } from "react";

import clsx from "clsx";
import { Loader, ScanLine, X } from "lucide-react";
import {
  DropzoneInputProps,
  DropzoneRootProps,
  FileRejection,
  useDropzone,
} from "react-dropzone";

import { IconButton } from "./ui";

const ACCEPTED_FILE_TYPES = {
  "image/png": [".png", ".PNG"],
  "image/jpeg": [".jpg", ".jpeg", ".JPG", ".JPEG"],
} as const;

const ERROR_MESSAGE = "Only allowed to upload PNG or JPEG files.";

type FileUploadZoneProps = {
  children?: React.ReactNode;
  isLoading?: boolean;
  onFileUpload?: (files: File[]) => void;
};

const LoadingOverlay = () => (
  <>
    <div className="z-5 absolute inset-0 bg-orange-500/30 backdrop-md h-1 animate-scan-line" />
    <div className="top-1/2 left-1/2 z-10 absolute flex justify-center items-center bg-white px-2 py-1 rounded-md text-gray-700 -translate-x-1/2 -translate-y-1/2">
      <Loader className="animate-spin" /> Loading
    </div>
  </>
);

const FilePreview = ({
  files,
  isLoading,
  onClear,
}: {
  files: File[];
  isLoading: boolean;
  onClear: () => void;
}) => (
  <div
    className={clsx(
      isLoading && "opacity-45",
      "relative w-full h-full preview-zone"
    )}
  >
    {!isLoading && (
      <IconButton
        onClick={onClear}
        icon={<X size={16} />}
        className="-top-2 -right-2 z-10 absolute bg-white"
      />
    )}
    {files.map((file, index) => (
      <img
        key={index}
        src={URL.createObjectURL(file)}
        alt={file.name}
        className="w-full h-full object-contain"
      />
    ))}
  </div>
);

const UploadPrompt = ({
  getRootProps,
  getInputProps,
}: {
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps;
}) => (
  <div
    {...getRootProps({
      className:
        "dropzone h-full w-full flex justify-center items-center gap-4 flex-col",
    })}
  >
    <input
      type="file"
      className="absolute inset-0 opacity-0 cursor-pointer"
      {...getInputProps()}
    />
    <ScanLine size={40} />
    <div>
      <p className="font-medium">Take a photo</p>
      <p className="text-gray-500 text-sm underline">or upload receipt</p>
    </div>
  </div>
);

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileUpload,
  isLoading = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadedFiles(acceptedFiles);
      onFileUpload?.(acceptedFiles);
    },
    [onFileUpload]
  );

  const handleDropRejected = useCallback((fileRejections: FileRejection[]) => {
    alert(ERROR_MESSAGE);
  }, []);

  const handleClear = useCallback(() => {
    setUploadedFiles([]);
    onFileUpload?.([]);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    multiple: false,
  });

  const containerClasses = useMemo(
    () =>
      clsx(
        isDragActive && "border-blue-200 bg-blue-50",
        isLoading && "bg-black/10",
        "relative overflow-hidden flex justify-center items-center border-2 bg-[var(--background)] border-slate-200 hover:border-blue-200 p-4 border-dashed rounded-lg w-full h-full cursor-pointer"
      ),
    [isDragActive, isLoading]
  );

  return (
    <div className="relative bg-white p-4 border border-gray-300 rounded-lg h-80">
      <div className={containerClasses}>
        {isLoading && <LoadingOverlay />}

        {uploadedFiles.length > 0 ? (
          <FilePreview
            files={uploadedFiles}
            isLoading={isLoading}
            onClear={handleClear}
          />
        ) : (
          <UploadPrompt
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />
        )}
      </div>
    </div>
  );
};

export default FileUploadZone;

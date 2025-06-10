import React, { SetStateAction } from "react";
import { IRfp } from "../../types/rfpTypes";

interface AddAttachmentProps {
  requestData: any
  setRequestData: React.Dispatch<SetStateAction<any>>;
  masterData: any
}

const AddAttachment: React.FC<AddAttachmentProps> = ({
  requestData,
  setRequestData,
  masterData
}) => {

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFiles = event.target.files ? event.target.files[0] : null;
  //   if (selectedFiles) {
  //     setRequestData((prev:IRfp) => ({...prev,  rfpDocuments: [...prev.rfpDocuments,selectedFiles]})); // Add new files to the current list
  //   }
  // };

  // const removeFile = (index: number) => {
  //   const updatedFiles = attachments.filter((_, i) => i !== index);
  //   if (setAttachmentsToDelete && attachments[index].id) setAttachmentsToDelete(x => ([...x, attachments[index].id as string]))
  //   setAttachments(updatedFiles);
  // };

  return (
    <div className="w-full rounded-md ">

      {/* Display uploaded files */}
      {/* <div className="flex flex-wrap gap-2 mb-4">
        {attachments.map((file, index) => (
          <div
            key={index}
            className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 shadow-sm relative"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">
                {file.documentName}
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div> */}

      {/* File input section */}
      {/* <div className="flex flex-col items-center justify-center border" style={{ border: "1px dotted black", height: "100px" }}>
        <label
          htmlFor="file-upload"
          className="text-blue-600 hover:underline cursor-pointer text-sm font-medium mb-1"
        >
          Add more files browse
        </label>
        <input
          type="file"
          id="file-upload"
          accept=".pdf,.docx,.jpg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="text-xs text-gray-500">Max. file size : 20MB</span>
      </div> */}
    </div>
  );
};

export default AddAttachment;

import React from "react";

interface AddAttachmentProps {
  setAttachments: React.Dispatch<React.SetStateAction<any[]>>
  attachments: any[];
}

const AddAttachment: React.FC<AddAttachmentProps> = ({ setAttachments, attachments }) => {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? event.target.files[0] : null;
    if (selectedFiles) {
      setAttachments((prevFiles) => [...prevFiles, { document: selectedFiles, documentName: selectedFiles.name } as any]); // Add new files to the current list
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = attachments.filter((_, i) => i !== index);
    setAttachments(updatedFiles);
  };

  return (
    <div className="p-4">
      {/* Uploaded File Previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm text-sm text-gray-700"
            >
              <span>{file.documentName}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-600"
                title="Remove file"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File Upload Dropzone */}
      <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
        <label
          htmlFor="file-upload"
          className="absolute inset-0 flex flex-col items-center justify-center text-center text-blue-600 hover:underline"
        >
          <span className="font-medium">Click to upload the file</span>
          <span className="text-xs text-gray-500 mt-1">Max. file size: 20MB</span>
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.docx,.jpg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>

  );
};

export default AddAttachment;

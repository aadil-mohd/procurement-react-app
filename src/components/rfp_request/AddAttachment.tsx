import React from "react";
import FileUpload from "../basic_components/FileUpload";


interface AddAttachmentProps {
  setData: (field: string, value: any) => void;
}

const AddAttachment: React.FC<AddAttachmentProps> = ({ setData }) => {
  // Callback to handle file change
  const handleFilesChange = (files: FileList | null) => {
    if (files) {
      setData("attachments", Array.from(files)); // Update parent state with files
    }
  };

  return (
    <div>
      {/* Use the FileUpload component here */}
      <FileUpload
        id="file-upload"
        label="Upload Files"
        onFilesChange={handleFilesChange}
        acceptedFileTypes=".pdf,.docx,.jpg,.png"
        multiple={true} // Allow multiple files to be selected
      />
    </div>
  );
};

export default AddAttachment;

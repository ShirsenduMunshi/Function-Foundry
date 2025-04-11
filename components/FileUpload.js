// "use client";
// import { useCallback, useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';

// export default function FileUpload({ 
//   onUpload, 
//   endpoint = '/api/upload/resume', // Default endpoint for resumes
//   disabled = false
// }) {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const onDrop = useCallback((acceptedFiles) => {
//     setFile(acceptedFiles[0]);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'application/pdf': ['.pdf'],
//       'application/msword': ['.doc'],
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
//     },
//     maxFiles: 1,
//     disabled: disabled || uploading
//   });

//   const handleUpload = async () => {
//     if (!file) return;
    
//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       const response = await fetch(endpoint, {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Upload failed');
//       }

//       onUpload(data.url); // Expecting { url: 'cloudinary-url' } response
//       toast.success('File uploaded successfully!');
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error(error.message || 'Failed to upload file');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleRemove = () => {
//     setFile(null);
//     onUpload(''); // Clear the uploaded URL
//   };

//   return (
//     <div className="space-y-4">
//       <div 
//         {...getRootProps()} 
//         className={`border-2 border-dashed rounded-lg p-6 text-center ${
//           isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
//         } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
//       >
//         <input {...getInputProps()} />
//         {file ? (
//           <div>
//             <p className="font-medium">{file.name}</p>
//             <p className="text-sm text-muted-foreground">
//               {(file.size / 1024 / 1024).toFixed(2)} MB
//             </p>
//           </div>
//         ) : isDragActive ? (
//           <p>Drop file here...</p>
//         ) : (
//           <p>Drag & drop a file here, or click to select</p>
//         )}
//       </div>
      
//       {file && (
//         <div className="flex-col gap-2">
//           <Button 
//             variant="outline" 
//             onClick={handleRemove}
//             disabled={uploading}
//             className="w-full"
//           >
//             Remove
//           </Button>
//           <Button 
//             onClick={handleUpload}
//             disabled={uploading || disabled}
//             className="w-full"
//           >
//             {uploading ? "Uploading..." : "Upload File"}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function FileUpload({ onUpload, disabled, endpoint = '/api/upload/resume' }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: disabled || uploading
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      onUpload({
        url: data.url,
        filename: data.filename || file.name
      });
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemove = () => {
    setFile(null);
    onUpload(''); // Clear the uploaded URL
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : isDragActive ? (
          <p>Drop file here...</p>
        ) : (
          <p>Drag & drop a file here, or click to select</p>
        )}
      </div>
      
      {file && (
        <div className="flex-col gap-2">
          <Button 
            variant="outline" 
            onClick={handleRemove}
            disabled={uploading}
            className="w-full"
          >
            Remove
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={uploading || disabled}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      )}
    </div>
  );
}
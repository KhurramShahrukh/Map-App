import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../Common/Types';
import { setParsedAddresses } from '../Reducers/DropSlice';


const Drop: React.FC = () => {
  const addresses = useSelector((state: RootState) => state.Drop.parsedAddresses);
  const dispatch = useDispatch<AppDispatch>();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Check the number of dropped files
      if (acceptedFiles.length !== 1) {
        alert('Please drop only one CSV file at a time.');
        console.error('Multiple files dropped. Please drop only one CSV file at a time.');
        return;
      }

      // Assuming only one file is dropped
      const file = acceptedFiles[0];

      // Check file type
      if (!file || file.type !== 'text/csv') {
        alert('Wrong file type!')
        console.error('Invalid file type. Please upload a CSV file.');
        return;
      }

      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (result) => {
          // Check CSV header format
          const headers: any = result.data[0];
          const expectedHeaders = ['Name', 'Address', 'City', 'State', 'zipCode', 'Country'];

          if (!headers || headers.length !== expectedHeaders.length || !expectedHeaders.every((header, index) => headers[index] === header)) {
            alert('Wrong CSV file Format!')
            console.error('Invalid CSV format. Please ensure the CSV follows the required format.');
            return;
          }

          // 'result.data' contains parsed CSV data
          const parsedAddresses: string[] = result.data.slice(1).map((row: any, index: number) => {
            return row.join('')
          });
          dispatch(setParsedAddresses(parsedAddresses))
        },
        error: (error) => {
          console.error('CSV parsing error:', error.message);
        },
      });
    },
    [dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.csv' });

  return (
    <div>
      <div {...getRootProps()}
        style={{
          border: '.125rem dashed #cccccc',
          borderRadius: '.25rem',
          padding: '1.25rem',
          textAlign: 'center',
          cursor: 'pointer',
        }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CSV file here...</p>
        ) : (
          <p>Drag 'n' drop a CSV file here, or click to select one</p>
        )}
      </div>
      {addresses.length > 0 &&
        <div>
          <h3>Addresses:</h3>
          <ul style={{ margin: 0 }}>
            {addresses.map((address: string, index) => (
              <li key={index}>
                {address}
              </li>
            ))}
          </ul>
        </div>
      }
    </div>
  );
};

export default Drop
'use client';

import { useState } from 'react';

interface IPFSResult {
  ipfsUrl: string;
  cid: string;
  path: string;
}

export default function TestIPFS() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IPFSResult | null>(null);

  const testIPFSUpload = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Starting IPFS upload test...');
      const response = await fetch('/api/ipfs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          certificateId: 'TEST-' + Date.now(),
          issueDate: new Date().toISOString(),
          additionalData: {
            course: 'Test Course',
            grade: 'A+'
          }
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!data.success) {
        throw new Error(data.error || 'Failed to upload certificate');
      }

      setResult(data.data);
    } catch (error) {
      console.error('Error in test upload:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test IPFS Upload</h2>
      <button
        onClick={testIPFSUpload}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Uploading...' : 'Test Upload'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <h3 className="font-bold">Upload Successful!</h3>
          <p>IPFS URL: <a href={result.ipfsUrl} target="_blank" rel="noopener noreferrer" className="underline">{result.ipfsUrl}</a></p>
          <p>CID: {result.cid}</p>
          <p>Path: {result.path}</p>
        </div>
      )}
    </div>
  );
} 
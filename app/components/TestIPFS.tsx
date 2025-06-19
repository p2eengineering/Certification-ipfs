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
// ... existing code ...
} 
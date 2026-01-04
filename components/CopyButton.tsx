// components/CopyButton.tsx
'use client';
import { useState } from 'react';

export function CopyButton({ text, label = '복사' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error('clipboard error', e);
    }
  };

  return (
    <button className="copy-btn" type="button" onClick={handleCopy} aria-live="polite">
      {copied ? '복사됨' : label}
    </button>
  );
}

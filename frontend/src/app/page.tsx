'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:8080/hello')
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage('Failed to fetch message'));
  }, []);

  return (
    <div>{message}</div>
  );
}

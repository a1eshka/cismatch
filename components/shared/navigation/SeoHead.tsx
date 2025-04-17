// components/SeoHead.tsx
'use client';

import { useEffect } from 'react';
import Head from 'next/head';

interface SeoHeadProps {
  title: string;
  description: string;
  keywords: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({ title, description, keywords }) => {
  useEffect(() => {
    // Это будет срабатывать при изменении компонента, добавляя или изменяя мета-теги
    document.title = title;
  }, [title]);

  return (
    <Head>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* Здесь можно добавлять другие мета-теги, если нужно */}
    </Head>
  );
};

export default SeoHead;

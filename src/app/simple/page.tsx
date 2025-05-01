'use client';
import { SimpleEditor } from '@/components/tiptap/tiptap-templates/simple/simple-editor';
import { useState } from 'react';

export default function Page() {
  const [content, setContent] = useState('');
  console.log(content);
  return <SimpleEditor onChange={setContent} />;
}

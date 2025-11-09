'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import type { Language } from '@/lib/types';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const languageMap: Record<Language, string> = {
  KOTLIN: 'java',
  JAVA: 'java',
  PYTHON: 'python',
};

interface CodeEditorProps {
  value: string;
  language: Language;
  readOnly?: boolean;
  height?: number;
  onChange?: (value: string) => void;
}

export const CodeEditor = ({ value, language, onChange, readOnly, height = 420 }: CodeEditorProps) => {
  const mappedLanguage = languageMap[language];
  const key = useMemo(() => `${language}-${readOnly ? 'readonly' : 'editable'}`, [language, readOnly]);

  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-950/60">
      <MonacoEditor
        key={key}
        height={height}
        language={mappedLanguage}
        theme="vs-dark"
        value={value}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Menlo, monospace',
          automaticLayout: true,
          readOnly,
          scrollBeyondLastLine: false,
          tabSize: 2,
        }}
        onChange={(val) => onChange?.(val ?? '')}
      />
    </div>
  );
};

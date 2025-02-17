import React, { useEffect, useState } from 'react';
import LogTable from './components/LogTable';
import FloatingSidebar from './components/FloatingSidebar';

// Key used to store file history in localStorage (if used)
const HISTORY_KEY = 'logFileHistory';
const MAX_HISTORY_ITEMS = 10;

function App() {
  const [logs, setLogs] = useState([]);

  // ファイルアップロードやその他の処理…（ファイル履歴機能は不要の場合は削除可）
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      processFileContent(file.name, e.target.result);
    };
    reader.readAsText(file);
  };

  const processFileContent = (fileName, content) => {
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
    const parsedLogs = lines.map(line => {
      try {
        const json = JSON.parse(line);
        return transformLogEntry(json);
      } catch (err) {
        return { error: 'Invalid JSON', raw: line };
      }
    });
    setLogs(parsedLogs);
  };

  const transformLogEntry = (entry) => {
    const { datetime, msec, app, level, ...rest } = entry;
    const nestedKey = Object.keys(rest)[0];
    const logClass = nestedKey || '';
    let message = '';
    if (nestedKey) {
      const nested = rest[nestedKey];
      message = nested && typeof nested === 'object'
        ? nested.msg || JSON.stringify(nested)
        : nested.toString();
    }
    return {
      datetime: datetime || '',
      msec: msec || '',
      app: app || '',
      level: level || '',
      Class: logClass,
      Message: message
    };
  };

  return (
    <div style={{ display: 'flex' }}>
      <FloatingSidebar onFileSelect={handleFileUpload} />
      <div style={{ marginLeft: '270px', padding: '20px', width: 'calc(100% - 270px)', overflowX: 'hidden' }}>
        <h1 style={{ textAlign: 'center' }}>Log File Viewer</h1>
        <LogTable logs={logs} />
      </div>
    </div>
  );
}

export default App;

import React, { useState } from 'react'
import LogTable from './components/LogTable'
import FloatingSidebar from './components/FloatingSidebar'

// Key used to store file history in localStorage (if used)
const HISTORY_KEY = 'logFileHistory'
const MAX_HISTORY_ITEMS = 10

function App() {
  const [logs, setLogs] = useState([])
  const [selectedMessage, setSelectedMessage] = useState('')

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      processFileContent(file.name, e.target.result)
    }
    reader.readAsText(file)
  }

  const processFileContent = (fileName, content) => {
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '')
    const parsedLogs = lines.map(line => {
      try {
        const json = JSON.parse(line)
        return transformLogEntry(json)
      } catch (err) {
        return { error: 'Invalid JSON', raw: line }
      }
    })
    setLogs(parsedLogs)
  }

  const transformLogEntry = (entry) => {
    const { datetime, msec, app, level, ...rest } = entry
    const nestedKey = Object.keys(rest)[0]
    const logClass = nestedKey || ''
    let message = ''
    if (nestedKey) {
      const nested = rest[nestedKey]
      message = nested && typeof nested === 'object'
        ? JSON.stringify(nested)
        : nested.toString()
    }
    return {
      datetime: datetime || '',
      msec: msec || '',
      app: app || '',
      level: level || '',
      class: logClass,
      message: message
    }
  }

  // Callback when a row is selected in the log table.
  const handleRowSelect = (message) => {
    setSelectedMessage(message)
  }

  // Function to highlight symbols (punctuation) in red.
  const highlightSymbols = (message) => {
    const parts = message.split(/([!-/:-@[-`{-~])/g)
    return parts.map((part, index) => {
      if (/^[!-/:-@[-`{-~]$/.test(part)) {
        return <span key={index} style={{ color: 'red' }}>{part}</span>
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex' }}>
          <FloatingSidebar onFileSelect={handleFileUpload} />
          <div style={{ marginLeft: '270px', padding: '20px', width: 'calc(100% - 270px)' }}>
            <h1 style={{ textAlign: 'center' }}>Log File Viewer</h1>
            <LogTable logs={logs} onRowSelect={handleRowSelect} />
          </div>
        </div>
      </div>
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '250px',
        width: '100%',
        background: '#eee',
        borderTop: '1px solid #ccc',
        padding: '10px',
        textAlign: 'left',
        wordWrap: 'break-word',
        whiteSpace: 'normal'
      }}>
        {selectedMessage && <p style={{ margin: 0 }}>{highlightSymbols(selectedMessage)}</p>}
      </div>
    </div>
  )
}

export default App

import React, { useState, useRef, useEffect } from 'react'
import FileUploadButton from './FileUploadButton'
import './FloatingSidebar.css'

// FloatingSidebar renders a resizable floating sidebar with a file upload button.
function FloatingSidebar({ onFileSelect }) {
  const [sidebarWidth, setSidebarWidth] = useState(250)
  const sidebarRef = useRef(null)
  const isResizing = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = sidebarWidth + 'px'
    }
  }, [sidebarWidth])

  return (
    <div ref={sidebarRef} className="floating-sidebar" style={{ width: sidebarWidth }}>
      <FileUploadButton onFileSelect={onFileSelect} />
    </div>
  )
}

export default FloatingSidebar

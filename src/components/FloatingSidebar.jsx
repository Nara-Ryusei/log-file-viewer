import React, { useState, useRef, useEffect } from 'react';
import FileUploadButton from './FileUploadButton';
import './FloatingSidebar.css';

// FloatingSidebar renders a resizable floating sidebar with a file upload button.
function FloatingSidebar({ onFileSelect }) {
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const sidebarRef = useRef(null);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = (e) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isResizing.current) return;
    const delta = e.clientX - startX.current;
    // Clamp the new width between 200px and window.innerWidth
    const newWidth = Math.min(Math.max(startWidth.current + delta, 200), window.innerWidth);
    setSidebarWidth(newWidth);
  };

  const onMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = sidebarWidth + 'px';
    }
  }, [sidebarWidth]);

  return (
    <div ref={sidebarRef} className="floating-sidebar" style={{ width: sidebarWidth }}>
      <FileUploadButton onFileSelect={onFileSelect} />
      <div className="sidebar-drag-handle" onMouseDown={onMouseDown} />
    </div>
  );
}

export default FloatingSidebar;

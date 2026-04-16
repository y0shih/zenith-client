import React, { useRef, useState } from 'react'
import { UploadCloud, File, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FileUploadProps {
  accept?: string
  maxSizeMB?: number
  value?: File | null
  onChange?: (file: File | null) => void
  onUrlChange?: (url: string) => void
  disabled?: boolean
  className?: string
  previewRender?: (file: File) => React.ReactNode
}

export function FileUpload({
  accept = 'application/pdf',
  maxSizeMB = 5,
  value,
  onChange,
  disabled = false,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return
    
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0])
    }
  }

  const handleFiles = (file: File) => {
    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds ${maxSizeMB}MB limit.`)
      return
    }

    // Validate type roughly
    if (accept && accept !== '*') {
      const allowedTypes = accept.split(',').map((t) => t.trim())
      const isAllowed = allowedTypes.some((type) => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        return file.type.match(type)
      })

      if (!isAllowed) {
        alert('File type not allowed.')
        return
      }
    }

    if (onChange) {
      onChange(file)
    }
  }

  const removeFile = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    if (onChange) {
      onChange(null)
    }
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  if (value) {
    return (
      <div className={cn("relative flex items-center p-4 border-2 border-border bg-muted/30 rounded-none", className)}>
        <File className="w-8 h-8 text-primary mr-4" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{value.name}</p>
          <p className="text-xs text-secondary">{(value.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <button
          type="button"
          onClick={removeFile}
          disabled={disabled}
          className="p-2 ml-4 hover:bg-destructive/10 hover:text-destructive rounded-none transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative flex px-6 py-10 border-2 border-dashed border-border transition-colors cursor-pointer bg-background hover:bg-muted/50 rounded-none items-center justify-center text-center",
        dragActive && "border-primary bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={false}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
      <div>
        <UploadCloud className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
        <p className="text-sm font-medium text-foreground">
          Click or drag file to this area to upload
        </p>
        <p className="text-xs text-secondary mt-1">
          Supports {accept} up to {maxSizeMB}MB
        </p>
      </div>
    </div>
  )
}

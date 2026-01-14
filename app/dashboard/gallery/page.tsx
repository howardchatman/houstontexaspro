'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface GalleryImage {
  id: string
  image_url: string
  caption: string | null
  project_type: string | null
  display_order: number
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [contractorId, setContractorId] = useState('')
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [caption, setCaption] = useState('')
  const [projectType, setProjectType] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: contractor } = await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!contractor) return

    setContractorId(contractor.id)

    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('contractor_id', contractor.id)
      .order('display_order', { ascending: true })

    setImages(data || [])
    setLoading(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setShowUploadDialog(true)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !contractorId) return

    setUploading(true)

    try {
      // Upload to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${contractorId}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName)

      // Save to database
      const { data: newImage, error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          contractor_id: contractorId,
          image_url: publicUrl,
          caption: caption || null,
          project_type: projectType || null,
          display_order: images.length,
        })
        .select()
        .single()

      if (dbError) throw dbError

      setImages((prev) => [...prev, newImage])
      resetUploadForm()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageId: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/gallery/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        await supabase.storage.from('gallery').remove([filePath])
      }

      // Delete from database
      await supabase.from('gallery_images').delete().eq('id', imageId)

      setImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete image')
    }
  }

  const resetUploadForm = () => {
    setShowUploadDialog(false)
    setSelectedFile(null)
    setPreviewUrl('')
    setCaption('')
    setProjectType('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Photo Gallery</h1>
          <p className="text-gray-500">Showcase your work to potential customers</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Photo
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden group">
              <div className="aspect-square relative">
                <img
                  src={image.image_url}
                  alt={image.caption || 'Project photo'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(image.id, image.image_url)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
              {(image.caption || image.project_type) && (
                <CardContent className="p-3">
                  {image.caption && (
                    <p className="text-sm text-gray-600 truncate">{image.caption}</p>
                  )}
                  {image.project_type && (
                    <p className="text-xs text-gray-400">{image.project_type}</p>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No Photos Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Upload photos of your completed projects to showcase your work
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Your First Photo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
            <DialogDescription>
              Add details about this project photo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {previewUrl && (
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                placeholder="e.g., Kitchen remodel in The Heights"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Input
                id="projectType"
                placeholder="e.g., Kitchen Remodel"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={resetUploadForm}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Upload, Download, Trash2 } from "lucide-react"

export default function Home() {
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Reset processed image
      setProcessedImage(null)
    }
  }

  const removeBackground = async () => {
    if (!image) return

    setLoading(true)

    const formData = new FormData()
    formData.append("image_file", image)

    try {
      const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
        headers: {
          "X-Api-Key": process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY,
        },
        responseType: "blob",
      })

      const url = URL.createObjectURL(response.data)
      setProcessedImage(url)
    } catch (error) {
      console.error("Error removing background:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearImage = () => {
    setImage(null)
    setImagePreview(null)
    setProcessedImage(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img src="/logo.png" alt="Logo" className="w-12 h-12" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Gomma
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Remove backgrounds from your images instantly</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Upload Section */}
            <div className="mb-8">
            <div className="file-input-wrapper">
              <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
              <label htmlFor="image-upload" className={`file-input-label ${image ? "has-file" : ""}`}>
              {imagePreview ? (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="max-h-32 w-auto object-contain rounded-lg"
                />
                </div>
              ) : (
                <div className="text-center">
                <Upload className="w-8 h-8 text-muted-foreground mb-1 mx-auto" />
                <p className="text-lg font-medium mb-2">Click to browse</p>
                </div>
              )}
              </label>
            </div>

            {/* Action Buttons */}
            {image && (
              <div className="flex gap-3 mt-6 justify-center">
              <Button
                onClick={removeBackground}
                disabled={loading}
                className="px-8 py-3 text-lg font-medium bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? (
                <>
                  <Spinner />
                  Processing...
                </>
                ) : (
                "Remove Background"
                )}
              </Button>
              <Button onClick={clearImage} variant="outline" className="px-6 py-3 bg-transparent">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              </div>
            )}
            </div>

          {/* Results Section */}
          {processedImage && (
            <div className="bg-card rounded-2xl p-8 border">
              <h2 className="text-2xl font-semibold mb-6 text-center">Background Removed</h2>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Original */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-center text-muted-foreground">Original</h3>
                  <div className="bg-muted rounded-xl p-4 flex items-center justify-center min-h-[200px]">
                    {imagePreview && (
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Original"
                        width={300}
                        height={300}
                        className="max-w-full max-h-64 object-contain rounded-lg"
                      />
                    )}
                  </div>
                </div>

                {/* Processed */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-center text-muted-foreground">Processed</h3>
                  <div className="bg-muted rounded-xl p-4 flex items-center justify-center min-h-[200px] relative">
                    {/* Checkerboard pattern for transparency */}
                    <div
                      className="absolute inset-4 opacity-20 rounded-lg"
                      style={{
                        backgroundImage: `
                             linear-gradient(45deg, #666 25%, transparent 25%),
                             linear-gradient(-45deg, #666 25%, transparent 25%),
                             linear-gradient(45deg, transparent 75%, #666 75%),
                             linear-gradient(-45deg, transparent 75%, #666 75%)
                           `,
                        backgroundSize: "20px 20px",
                        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                      }}
                    ></div>
                    <Image
                      src={processedImage || "/placeholder.svg"}
                      alt="Processed"
                      width={300}
                      height={300}
                      className="max-w-full max-h-64 object-contain rounded-lg relative z-10"
                    />
                  </div>
                </div>
              </div>

              {/* Download Button */}
                <div className="text-center">
                <a href={processedImage} download="background-removed.png">
                  <Button
                  size="lg"
                  className="px-8 py-3 text-lg font-medium bg-red-600 hover:bg-red-700 text-white"
                  >
                  <Download className="w-5 h-5 mr-2" />
                  Download Image
                  </Button>
                </a>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

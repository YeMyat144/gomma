'use client';

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const removeBackground = async () => {
    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('image_file', image);

    try {
      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          headers: {
            'X-Api-Key': process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY,
          },
          responseType: 'blob',
        }
      );

      const url = URL.createObjectURL(response.data);
      setProcessedImage(url);
    } catch (_) {
      console.error('Error removing background');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Remove Background</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label htmlFor="image">Upload Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={removeBackground} disabled={!image || loading} className="w-full">
            {loading ? <Spinner /> : 'Remove Background'}
          </Button>
        </CardFooter>
      </Card>
      {processedImage && (
        <Card className="w-full max-w-md mt-4">
          <CardHeader>
            <CardTitle>Processed Image</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src={processedImage}
              alt="Processed"
              width={500}
              height={300}
              className="w-full rounded-md"
            />
          </CardContent>
          <CardFooter>
            <a
              href={processedImage}
              download="processed-image.png"
              className="w-full"
            >
              <Button className="w-full">Download Image</Button>
            </a>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
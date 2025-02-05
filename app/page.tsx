'use client';

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
    <div className="container mx-auto min-h-full flex items-center justify-center w-full mt-16">
      <Card className="w-full max-w-xl border-none shadow-none">
        <CardHeader className="flex items-center p-4 space-x-2">   
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo" className="w-14 h-auto" />  
            <span className="text-5xl font-bold">Gomma</span>  
          </div>
        </CardHeader>
        <br />

        <CardContent>
          <div className="flex space-x-4">
            <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
            <Button onClick={removeBackground} disabled={!image || loading} className="w-auto">
              {loading ? <Spinner /> : 'Remove'}
            </Button>
          </div>
        </CardContent>
      </Card>
      {processedImage && (
        <Card className="w-full max-w-xl border-none shadow-none mt-4">
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
              <Button className="w-full">Download</Button>
            </a>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

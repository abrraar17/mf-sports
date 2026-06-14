'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Upload, Loader2 } from 'lucide-react';

// Uploads to Supabase Storage bucket "site-images" and returns public URL via onUploaded
export default function ImageUploader({ currentUrl, onUploaded, folder = 'general' }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from('site-images').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      alert('Upload failed: ' + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('site-images').getPublicUrl(fileName);
    setPreview(data.publicUrl);
    onUploaded(data.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full max-w-xs h-40 object-cover rounded-lg mb-3 border border-white/10"
        />
      )}
      <label className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm px-4 py-2.5 rounded-lg cursor-pointer transition-colors">
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {uploading ? 'Uploading...' : 'Upload Image'}
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>
    </div>
  );
}

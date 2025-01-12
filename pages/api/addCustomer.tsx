import { createClient } from '@/utils/supabase/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { Files, IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import uuid from 'react-uuid';
export const config = {
  api: {
    bodyParser: false,
  },
};

type CustomerData = {
  [key: string]: string | number | undefined | File;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient();
  if (req.method === 'POST') {
    const form = new IncomingForm();
    const customerData: CustomerData = {} 
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Error parsing form data' });
      }
      if (fields) {
        Object.entries(fields).forEach(([key, value]) => {
          if (key != 'photo') {
            customerData[key] = value?.join('') as string | number | undefined | File
          }
        });
      }
      const id = uuid()
      const { error } = await supabase.from('CustomerData').insert({...customerData,photo_name : id})
      if (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
      }

      const photo = files.photo && Array.isArray(files.photo) ? files.photo[0] : null;      
      if (photo) {
        const filePath = photo.filepath;
        try {
          const fileData = fs.readFileSync(filePath);
          const fileName = path.basename(id)
          console.log(fileName)
          const fileMimeType = photo.mimetype || 'application/octet-stream'
          const fileToUpload = new File([fileData], fileName, { type: fileMimeType })
          const { error } = await supabase.storage.from('photo').upload(fileToUpload.name, fileToUpload)
          console.log(error)
        } catch (error) {
          return res.status(500).json({ error: 'Error reading the file' });
        }
      }

    })

  }

  res.status(200).json({ message: "Success" });
}


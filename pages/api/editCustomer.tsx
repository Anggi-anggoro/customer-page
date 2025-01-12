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

type ListCustomer = {
  [key: string]: string | number | undefined | File;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient();
  if (req.method === 'POST') {
    const form = new IncomingForm();
    const customerData: ListCustomer = {} 
    let isNewPhoto = false
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
          if (key == 'photo_name' && (!value || value[0] == '')) {
            const id = uuid()
            isNewPhoto = true
            customerData[key] = id as string
            console.log('masok')
          }
        });
      }      
      
    
      const { error } = await supabase.from('CustomerData').upsert(customerData)
      if (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
      }

      const photo = files.photo && Array.isArray(files.photo) ? files.photo[0] : null;    

      if (photo) {
        const filePath = photo.filepath;
        try { 
          const fileData = fs.readFileSync(filePath);
          const fileName = customerData.photo_name as string          
          const fileMimeType = photo.mimetype || 'application/octet-stream'
          const fileToUpload = new File([fileData], fileName, { type: fileMimeType })
          if (!isNewPhoto) {
            const { error } = await supabase.storage.from('photo').update(fileToUpload.name, fileToUpload)
          } else {
            const { error } = await supabase.storage.from('photo').upload(fileToUpload.name, fileToUpload)
          }
          console.log(error)
        } catch (error) {
          return res.status(500).json({ error: 'Error reading the file' });
        }
      }

    })

  }

  res.status(200).json({ message: "Success" });
}


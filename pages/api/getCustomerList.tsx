import { createClient } from '@/utils/supabase/client'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createClient()
    try {
        const { data, error } = await supabase
            .from('CustomerData')
            .select().order('id')
        
        if (error) {
            throw error;
        }

        const dataList = data as ListCustomer[];

        const updatedDataList = await Promise.all(
            dataList.map(async (customer) => {
                if (customer.photo_name) {
                    const { data } = await supabase.storage.from('photo')
                        .getPublicUrl(customer.photo_name);
                    
                    return data 
                        ? { ...customer, photo_url: data.publicUrl }
                        : customer
                }
                return customer
            })
        );
        res.status(200).json(updatedDataList)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

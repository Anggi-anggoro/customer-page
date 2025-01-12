import { createClient } from '@/utils/supabase/client';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createClient()
    if (req.method === 'DELETE') {
        const customer = JSON.parse(req.body)
        if (!customer) {
            return res.status(400).json({ error: 'Customer ID is required' });
        }

        const { error } = await supabase
            .from('CustomerData')
            .delete()
            .eq('id', customer.id);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (`${customer.img}`) {            
            const { error } = await supabase.storage.from('photo').remove([`${customer.img}`])
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
        }



        return res.status(200).json({ message: 'Customer deleted successfully' });
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
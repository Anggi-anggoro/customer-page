import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image'

const CustomerDetailPage = async({ params }: {  params: Promise<{ slug: number }>}) => {
  
    const slug = (await params).slug
    const supabase = await createClient()

    const {data : customer} = await supabase.from('CustomerData').select().eq('id',slug)
  
    const {data : img} =await supabase.storage.from('photo').getPublicUrl(customer? customer[0].photo_name : '');
  
    return (
        <div className='p-10 h-[80vh]'>
            {customer?.map((customer: CustomerData,index : number) => 
                <div key={index}>
                    <p className='text-center text-3xl font-semibold mb-7'>{customer.name}</p>
                    <div className='flex max-sm:flex-col max-sm:items-center justify-between text-lg'>
                      <Image className='max-sm:w-32 rounded-sm' width={200} height={200} alt='' src={img.publicUrl} />
                      <div className='max-sm:pt-8 mobile:grid grid-cols-3 pl-5 [&>*:nth-child(even)]:col-span-2 [&>*:nth-child(even)]:max-sm:mb-4 [&>*:nth-child(even)]:max-mobile:text-sm [&>*:nth-child(odd)]:max-mobile:mb-1.5'>                        
                            <p>Email</p>
                            <p className=''><span className='max-mobile:hidden pr-1.5'>:</span>{customer.customer_email}</p>
                            <p>Address</p>
                            <p className=''><span className='max-mobile:hidden pr-1.5'>:</span>{customer.address}</p>
                            <p>Birthdate</p>
                            <p className=''><span className='max-mobile:hidden pr-1.5'>:</span>{customer.birthdate}</p>
                            <p>Phone</p>
                            <p className=''><span className='max-mobile:hidden pr-1.5'>:</span>{customer.telephone}</p>
                            <p>Nationality</p>
                            <p className=''><span className='max-mobile:hidden pr-1.5'>:</span>{customer.nationality}</p>
                        
                      </div>
                    </div>
                </div>
            )}
                
            
        </div>
    );
};

export default CustomerDetailPage;


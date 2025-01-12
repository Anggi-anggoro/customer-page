'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import placholderImg from '@/components/assets/person-placeholder.png'
import CustomerForm from '@/components/form-customer';
import { useRouter } from 'next/navigation';



const CustomerListPage = () => {
    const [customers, setCustomers] = useState<ListCustomer[]>([]);
    const [filterCustomer, setFilterCustomer] = useState<ListCustomer[]>(customers);
    const [filter,setFilter] =useState<FilterCustomer>({
        input_date : '',
        nationality: '',
        search :''
    })
    const [editData, setEditData] = useState<ListCustomer>()    
    const [loading, setLoading] = useState<boolean>(true);
    const [hideForm, setHideForm] = useState<boolean>(true)
    const router = useRouter()
    const getCustomerList = () => {
        fetch('/api/getCustomerList')
        .then((res) => {
          return res.json()
        })
        .then((data) => {            
          setCustomers(data)
          setFilterCustomer(data)        
          setLoading(false)
        });
    }
    
    const applyFilters = () => {
        let filtered = customers;
    
        if (filter.input_date) {
          filtered = filtered.filter((item) =>
            item.input_date.includes(filter.input_date)
          );
        }

        if (filter.nationality) {
            filtered = filtered.filter((item) => {
                if (filter.nationality === 'WNI') {
                  return item.nationality === 'Indonesia';
                } else if (filter.nationality === 'WNA') {
                  return item.nationality !== 'Indonesia';
                }
                return true
              });
        }

        if (filter.search) {
            filtered = filtered.filter((item) =>
                item.name?.includes(filter.search) || item.customer_email?.includes(filter.search)
             );
        }
 
        setFilterCustomer(filtered);
      };
    useEffect(() => {   
        getCustomerList()
    }, [])

    useEffect(() => {   
        applyFilters()
    }, [filter])

    const handleDelete = (id : number, img : string | undefined, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()  
        fetch('/api/deleteCustomer', {
            method : 'DELETE',
            body : JSON.stringify({id,img})
        })
        .then((res) => {            
            setCustomers(
                customers.filter((value : ListCustomer) => value.id != id)
            )
            setFilterCustomer(
                customers.filter((value : ListCustomer) => value.id != id)
            )

        })

    } 

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>, customer : ListCustomer) => {
            e.stopPropagation()
            setHideForm(false)
            setEditData(customer)            
    }

    const handleFilter = (value : string, type : string) => {        
        setFilter((prevFilters) => ({
          ...prevFilters,
          [type]: value,
        }));
    }

    const handleSort = (value : string) => {
        if(value == 'name' || value == 'customer_email') {
            const sortedCustomers = [...filterCustomer].sort((a, b) =>
                (a[value] ?? '').localeCompare(b[value] ?? '')
              );
              setFilterCustomer(sortedCustomers);
        } else if (value == 'date'){
             const sortedCustomers = [...filterCustomer].sort((a, b) =>{
             const dateA : Date = a.input_date ? new Date(a.input_date) : new Date(0)
             const dateB : Date = b.input_date ? new Date(b.input_date) : new Date(0)             
             return dateA.getTime() - dateB.getTime()
              });
              setFilterCustomer(sortedCustomers);
        } else {
            setFilterCustomer(customers)
        }
    }


    return (
        <div className='p-10 max-sm:w-full'>
            <div className='mb-6'>
                <h1 className='text-center pb-8 text-2xl'>Customer List</h1>
                <div className='md:flex max-md:mx-auto items-center gap-x-3 grid mobile:w-1/2 max-md:gap-y-5'>
                    <p>Filter:</p>
                    <select onChange={(e)=> handleFilter(e.target.value,'nationality')} defaultValue='' className='border rounded-lg px-2 py-1'>
                        <option value=''>WNI/WNA</option>
                        <option value='WNI'>WNI</option>
                        <option value='WNA'>WNA</option>
                    </select>
                    <input onChange={(e)=> handleFilter(e.target.value,'input_date')} type='date' placeholder='Input Date' className='border rounded-lg px-2 py-1'/>                    
                    <input onChange={(e)=> handleFilter(e.target.value,'search')} type='text'placeholder='Search by Name/Email' className='placeholder:text-xs placeholder:text-center border rounded-lg px-2 py-1' />
                    <select className='text-xs text-center border rounded-lg px-2 py-1' onChange={(e)=> handleSort(e.target.value)}>                        
                        <option>-Sort By-</option>
                        <option value='name'>Name</option>
                        <option value='customer_email'>Email</option>
                        <option value='date'>Input Date</option>
                    </select>
                </div>
            </div>
        {!loading ?
             <>
            <div className='grid grid-cols-3 gap-20 max-md:grid-cols-2 max-sm:grid-cols-1'>        
                {filterCustomer.map((customer, index :number) => (
                   <div onClick={()=> router.push(`/customer/detail/${customer.id}`)} className='text-xs cursor-pointer flex text-center flex-col items-center border rounded-md p-5 relative h-[28rem] justify-between' key={index}>                
                    <button className='absolute top-[-5px] right-[-0.5rem]' onClick={(e)=>handleDelete(customer.id, customer.photo_name, e)} >
                    <svg className='w-5 fill-red-700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>    
                    </button>
                    <p className='text-slate-400 text-xs pb-2'>{customer.input_date}</p>
                    <h1 className='font-bold'>{customer.name}</h1>       
                    <Image className='rounded-md m-2' width={100} height={100} alt='' src={customer.photo_url? customer.photo_url : placholderImg} />
                        <div className='flex flex-col gap-y-2 pb-2'>
                            <p>{customer.address}</p>
                            <p>{customer.customer_email}</p>
                            <p>{customer.birthdate}</p>
                            <p>{customer.telephone}</p>
                            <p>{customer.nationality}</p>     
                        </div>           
                    <button className='bg-[#0091FF] px-4 py-2 rounded-md text-white text-sm' onClick={(e)=> handleEdit(e,customer)}>Edit</button>        
                   </div>
                ))}
                {/* <div className='text-xs cursor-pointer flex text-center flex-col items-center border rounded-md p-5 relative h-[28rem]'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                </div> */}
            </div>
            <div className={`absolute top-0 left-0 right-0 bottom-0 z-10 bg-black bg-opacity-80 w-full xl:px-24 ${hideForm ? 'hidden' : ''}`}>
                <div className='py-8 rounded-lg bg-white xl:w-1/2 mx-auto mt-7 relative pt-16'>
                    <button onClick={()=>setHideForm(true)} className='absolute right-3 top-3'>
                        <svg className='w-10 fill-red-700 max-md:w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>    
                    </button>
                    <CustomerForm customerData={editData}/>
                </div>
            </div>
            </>
           :
           <div className='h-[100vh]'>
                Loading Data ...
            </div>
         }
        </div>
    );
};

export default CustomerListPage;


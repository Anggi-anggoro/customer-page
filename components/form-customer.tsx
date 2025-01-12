'use client'

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import placholderImage from '@/components/assets/person-placeholder.png'
import { useRouter } from "next/navigation";
import SearchableDropdown from "./searchable-dropdown";


const CustomerForm = (props : {customerData? : ListCustomer}) => {
    const initCustomerData: CustomerData = {
        name: "",
        customer_email: "",
        telephone: "",
        address: "",
        birthdate: "",
        nationality: "",
        photo_name: "",
        photo : undefined

    }
     const fileInputRef = useRef<HTMLInputElement>(null);
    const now = new Date();
    const dateNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    
    const [listCountry, setListCountry] = useState<Country[]>([])
    const [customer, setCustomer] = useState<CustomerData>(initCustomerData);
    const [country, setCountry] = useState<string | undefined>(props.customerData ? (props.customerData.nationality == 'Indonesia' ? 'Indonesia' : 'WNA') : "");
    const handleChange = (value: number | string | File | null, prop: string) => {     
        if(prop == 'photo' && props.customerData) {
            props.customerData.photo_url = ''
        }
        setCustomer({ ...customer, [prop]: value });        
    }


    const handleValidation = (data: CustomerData) => {

        let custData: keyof CustomerData;
        for (custData in data) {            
            switch (custData) {
                case 'telephone':
                    const telephone = data.telephone as string;
                    const telephoneRegex = /^[0-9]+$/g;
                    if (telephone.length < 10) {
                        alert('Telephone must be at least 10 digits');
                        return false;
                    } else if (!telephoneRegex.test(telephone)) {
                        alert('Telephone must be number');
                        return false;
                    }                                    
                case 'birthdate' :                        
                    if (data.birthdate != null && dateNow < data.birthdate) {
                        alert('Birthdate must be less than today');
                        return false;
                    }                               
                default:
                    break;
            }
        }
        return true

    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    
        e.preventDefault();
       const validData = handleValidation(customer);
       const formData = new FormData();

       Object.entries(customer).forEach(([key, value]) => {    
            formData.append(key, value);          
      });
       if(validData) {
            if(!props.customerData) {            
                const res = await fetch('/api/addCustomer', {
                    method: 'POST',
                    body: formData,
                });
                if (res.ok) {
                    alert('Data has been saved');
                    setCustomer(initCustomerData);
                    setCountry("");
                    if(fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }                    
                } else {
                    alert('Failed to save data');
                }
            } else {
                formData.append('id', `${props.customerData.id}`)
                const res = await fetch('/api/editCustomer', {
                    method: 'POST',
                    body: formData,
                });
                if (res.ok) {
                    alert('Data has been saved');
                    setCustomer(initCustomerData);
                    setCountry("");
                    if(fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }                    
                } else {
                    alert('Failed to save data');
                }
            }
       }
    }

    const handleCountry = (value: string) => {
        if (value == 'Indonesia') {
            setCountry('Indonesia');
            setCustomer({ ...customer, nationality: 'Indonesia' });
        } else {
            setCountry('WNA')
            setCustomer({ ...customer, nationality: undefined });
        }
    }
    useEffect(()=> {
        if (props.customerData) {
            setCustomer({
            ...customer,
            name: props.customerData.name,
            customer_email: props.customerData.customer_email,
            telephone: props.customerData.telephone,
            address: props.customerData.address,
            birthdate: props.customerData.birthdate,
            nationality: props.customerData.nationality,
            photo_name: props.customerData.photo_name,
            });
            setCountry(props.customerData.nationality == 'Indonesia' ? 'Indonesia' : 'WNA');
        }
    },[props.customerData])

    useEffect(()=> {
        fetch('https://restcountries.com/v3.1/all?fields=name')
        .then((res) => {
          return res.json()
        })
        .then((data) => {            
         const dataCountry : Country[] =  data.map((item : any, index : string) => {            
                return {
                    id : index.toString(),
                    name : item.name.common  
                }              
          })
          setListCountry(dataCountry)
        });
        
    },[])

    return (
        <div>
            <form onSubmit={handleSubmit} className={`grid grid-cols-2 gap-y-7 text-foreground w-3/4 mx-auto items-center max-mobile:flex flex-col max-mobile:items-start max-mobile:gap-2 max-mobile:[&>*:nth-child(even)]:mb-4 max-mobile:[&>*:nth-child(odd)]:text-sm [&>*:nth-child(odd)]:font-semibold`}>
                <label>Name</label>
                <input value={customer.name}  onChange={(e) => handleChange(e.target.value, 'name')} className="border px-3 py-1 rounded-md w-full" type="text" placeholder="Name" />
                <label>Email</label>
                <input value={customer.customer_email}  onChange={(e) => handleChange(e.target.value, 'customer_email')} className="border px-3 py-1 rounded-md w-full" type="email" placeholder="Email" />
                <label>Telephone</label>
                <input value={customer.telephone} onChange={(e) => handleChange(e.target.value, 'telephone')} className="border px-3 py-1 rounded-md w-full" type="number" placeholder="Telephone" />
                <label>Address</label>
                <input value={customer.address}  onChange={(e) => handleChange(e.target.value, 'address')} className="border px-3 py-1 rounded-md w-full" type="text" placeholder="Address" />
                <label>Birthdate</label>
                <input value={customer.birthdate}  onChange={(e) => handleChange(e.target.value, 'birthdate')} className="border px-3 py-1 rounded-md w-full" type="date" placeholder="Birthdate" />
                <label>Nationality</label>
                <select value={country} onChange={(e) => handleCountry(e.target.value)} className="border px-3 py-1 rounded-md w-full">
                    <option disabled value="">- Select Nationality -</option>
                    <option value='Indonesia' >WNI</option>
                    <option value='WNA'>WNA</option>
                </select>
                {
                    country == 'WNA' &&
                    <>
                        <label>Country</label>
                        <SearchableDropdown
                            isRequired={true}
                            options={listCountry}
                            label="name"
                            id="id"
                            selectedVal={customer.nationality ? customer.nationality : ''}
                            handleChange={(val) => handleChange(val,'nationality')}
                        />
                    </>

                }
                <label className="">Photo</label>
                <input required={props.customerData ? false : true} ref={fileInputRef}  onChange={(e) => handleChange(e.target.files ? e.target.files[0] : null, 'photo')} accept="image/png/jpeg/jpg" className="border px-3 py-1 rounded-md w-full" type="file" />
                
                <Image className={`col-start-2 max-mobile:self-center justify-self-center w-44 h-48 ${customer.photo_name ? '' : 'p-10'}`}  src={props.customerData?.photo_url ? props.customerData?.photo_url : (customer.photo ? URL.createObjectURL(customer.photo) : placholderImage)} alt="Customer Photo" width={100} height={100} />                
                <Button className="col-span-2 self-center max-mobile:w-3/4">Submit</Button>
            </form>       
        </div>
    );
};

export default CustomerForm;
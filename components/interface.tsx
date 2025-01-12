interface CustomerData {
    
    name: string | undefined 
    customer_email: string | undefined 
    telephone: string | undefined
    address: string | undefined
    birthdate : string | undefined
    nationality: string | undefined
    photo_name: string | undefined
    photo? :  File | undefined
    
}

interface ListCustomer extends CustomerData {
    photo_url : string
    id : number
    input_date : string
}

interface FilterCustomer {
    nationality: string | undefined,
    input_date : string,
    search : string
}

interface Option {
    [key: string]: string;
}

interface SearchableDropdownProps {
    options: Option[];
    label: string;
    id: string;
    selectedVal: string | null;
    handleChange: (value: string | null) => void;
    isRequired : boolean
}

interface Country extends Option{
    id : string
    name : string
}

interface ResponseCountry {

}
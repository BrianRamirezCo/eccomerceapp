import axios from 'axios'
import { useEffect, useState } from "react"
import {backendUrl} from '../App'
import { toast } from 'react-toastify'

const List = () => {

  const [list , setList]= useState([]);

  const fetchList = async () =>{

    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      console.log(response.data);
      
      if(response.data.success){
        setList(response.data.products);
      }else {
        toast.error(response.data.messagge)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.messagge)
      
    }
  }

  useEffect(()=>{
      fetchList()
    },[])

  return (
    <div>
      
    </div>
  )
}

export default List

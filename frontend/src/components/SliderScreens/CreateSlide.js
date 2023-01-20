import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import { getError } from '../../utils';




function CreateSlide() {
    
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;

const [sliderFields,setSliderFields]=useState({name:'',brand:'',category:'',subCategory:'',description:'',productID:'',sliderType:''})
  const [sliderFiles, setSliderFiles] = useState([])
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [productIds, setProductIds] = useState([]);

  
      useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/getAllCats`);
        // console.log(data)
        setCategories(data);
      } catch (err) {
        console.log(err)
      }
    };
       const fetchProductIds = async () => {
      try {
        const { data } = await axios.get(`/api/products/productIds`);
        // console.log(data)
        setProductIds(data)
      } catch (err) {
        console.log(err)
      }
    };
    
fetchProductIds()

    fetchCategories();
  }, []);
  

  const handleSlideFields = (e) => {
    let { name, value } = e.target
    if (name === 'category') { 
let selectedCategory=categories.find((category)=>{
  return category.slug===value
})
      setSubCategories(selectedCategory.subCategory)
      }

        setSliderFields({...sliderFields,[name]:value})

    
    }

    const submitHandler =  async  (e) => {
      e.preventDefault()



      if (sliderFields.sliderType === "product" && !sliderFields.productID) {
      toast.error("Please Add Product ID",500)
  return
      }
       let isValidID = productIds.some((id) => {
         return id._id===sliderFields.productID
       })
      
      if (!isValidID) {
      toast.error("Please Enter Valid Product ID",)
      return 
      }
      

const formData=new FormData()


      for (let i = 0; i < sliderFiles.length; i++){
formData.append('file',sliderFiles[i])

      }   
formData.append('name',sliderFields.name)
formData.append('brand',sliderFields.brand)
formData.append('category',sliderFields.category)
formData.append('subCategory',sliderFields.subCategory)
formData.append('productID', sliderFields.productID)
formData.append('description',sliderFields.description)
formData.append('sliderType',sliderFields.sliderType)
      
      

       axios.post('/api/sliders/createSlider', formData).then(res => {
             if (res.data.message === 'Slider Created') {
     toast.success("Slider Created Successfully")
              navigate('/admin/sliders')
            }
        }).catch((err) => {
          toast.error(getError(err))
              // navigate('/admin/sliders')
        })
    
    }




    const uploadFileHandler=(e) => {
     setSliderFiles(e.target.files)
    }


    return <>
          <Container className="container">
      <Helmet>
        {/* <title>Edit Product ${productId}</title> */}
      </Helmet>
      <h1>Create Slide</h1>

        <Form onSubmit={submitHandler}>

          <div className='row'>
            <div className='col-md-6 col-sm-12'>
              <label>Slider Name</label>
              <input className='form-control' name='name' onChange={handleSlideFields}/>
            </div>
            <div className='col-md-6 col-sm-12'>
               <label>Slider Type</label>
              <select className='form-select' name='sliderType' onChange={handleSlideFields}>
                <option>Choose option</option>
                <option value='category'>Category</option>
                <option value='subCategory'>Sub Category</option>
                <option value='product'>Product</option>
                </select>
             
            </div>
          </div>

          <div className='row'>
            <div className='col-md-6 col-sm-12'>
              <label>Category</label>
              <select className='form-select'  name='category' onChange={handleSlideFields}>
                {categories.map((category) => (
                  <option  value={category.slug}  key={category.slug} >{category.name}</option>
               ))}
              </select>
 
            </div>
            <div className='col-md-6 col-sm-12'>
            <label>Sub Category</label>
              <select className='form-select' name='subCategory' defaultValue={''}    disabled={sliderFields.sliderType==='category'} onChange={handleSlideFields}>
                 <option value=''>No Sub Category</option>
               {subCategories.map((subCat) => (
                  <option value={subCat.slug} key={subCat.slug}>{subCat.name}</option>
               ))}
              </select>
            </div>
          </div>


          <div className='row'>
            <div className='col-md-6 col-sm-12'>
               <label>Brand Name</label>
              <input className='form-control' name='brand' onChange={handleSlideFields}/>
             
            </div>
            <div className='col-md-6 col-sm-12'>
              <label>Description</label>
             <textarea className='form-control'  name='description' onChange={handleSlideFields} />
            </div>
          </div>
      
          <div className='row'>
            {sliderFields.sliderType==='product' && <div className='col-md-6 col-sm-12'>
              <label>Product Id</label>
              <input className='form-control' name='productID'   onChange={handleSlideFields}/>
            </div>}
            <div className='col-md-6 col-sm-12'>
              <label>Images</label>
              <input className='form-control' type='file' multiple name='name' onChange={uploadFileHandler}/>
            </div>
           
          </div>

          <div className='row justify-content-center mt-2'>
              <Button style={{width:'80px',marginRight:'10px'}}  onClick={()=>navigate('/admin/sliders')} >
              Cancel
            </Button>
   <Button type="submit" style={{width:'80px'}}>
              Create
            </Button>
</div>
        </Form>
  
    </Container>
      </>
}

export default CreateSlide
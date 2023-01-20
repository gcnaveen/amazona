import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { useLocation, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import Rating from '../components/Rating';
import { toast } from 'react-toastify';






function CategoryWiseProductList() {
 const { state, dispatch: ctxDispatch } = useContext(Store);
const [products,setProducts]=useState([])
const useQuery = () => new URLSearchParams(useLocation().search);
let query = useQuery();
  
  const {
    cart: { cartItems },
    } = state;
    
    
    async function fetchProducts() {
        
            let PRODUCT_URL=`/api/products/search?category=${query.get('name')}`
                
        if (query.get('type')==='subCategory') {
             PRODUCT_URL=`/api/products/search?subCategory=${query.get('name')}`
        }
        console.log(PRODUCT_URL)
        let response = await axios.get(PRODUCT_URL)
          console.log(response.data.products);
        setProducts(response.data.products)
        
    }
    useEffect(() => {
fetchProducts()
},[query.get('name'),query.get('type')])

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
    toast.success(`${item.name} Added to the cart`)

  };

  return   <div style={{position:'relative',zIndex:'500'}}>
      <h1 style={{position:'relative',zIndex:'500'}}>Products</h1>
      <div className="products">
        {products.map((ele) => {
            return <div className="product">
              <Card style={{ background: '#f8f9fa', width: '300px' }}>
                <Link to={`/product/${ele.slug}`}>
                  <img
                    src={ele.image}
                    className="card-img-top"
                    alt={ele.name}
                    style={{ height: '261px' }}
                  />
                </Link>
                <Card.Body>
                  <Link to={`/product/${ele.slug}`}>
                    <Card.Title>{ele.name}</Card.Title>
                  </Link>
                  <Rating rating={ele.rating} numReviews={ele.numReviews} />
                  <Card.Text>
                    <div style={{ display: 'flex' }}>
                      <div style={{ fontSize: '30px' }}>
                        {' '}
                        Rs.{ele.price - ele.productDiscountedPrice}{' '}
                      </div>
                      <div
                        style={{
                          textDecoration: 'line-through',
                          margin: '10px',
                        }}
                      >
                        {' '}
                        Rs.{ele.price}
                      </div>

                      <div
                        style={{
                          margin: 'auto',
                          background: '#dc3545',
                          color: 'white',
                        }}
                      >
                        (
                        {Math.floor(
                          (ele.productDiscountedPrice / ele.price) * 100
                        )}
                        % off)
                      </div>
                    </div>
                  </Card.Text>
                  {ele.countInStock === 0 ? (
                    state?.userInfo?.isAdmin ? null : (
                      <Button variant="light" disabled>
                        Out of stock
                      </Button>
                    )
                  ) : state?.userInfo?.isAdmin ? null : (
                    <Button onClick={() => addToCartHandler(ele)}>
                      Add to cart
                    </Button>
                  )}
                </Card.Body>
              </Card>
              {/* <Link to={`/sliders/${ele.slug}`}>
                <img src={ele.image} alt={ele.name} />
              </Link>
              <div className="product-info">
                <Link to={`/sliders/${ele.slug}`}>
                  <p>{ele.name} </p>
                </Link>
                <p>
                  <strong>Rs.{ele.price}</strong>
                </p>
                <button>Add to cart</button>
              </div> */}
            </div>
        })}
      </div>
    </div>
  
}

export default CategoryWiseProductList
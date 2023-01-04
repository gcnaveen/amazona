import React, { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
// import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import data from '../../data';
import Rating from '../Rating';
import { Store } from '../../Store';
// import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, sliders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function SlidingProducts() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const [{ loading, error, sliders }, dispatch] = useReducer(reducer, {
    sliders: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/sliders');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  //   console.log(state);

  //   const discountPrice = sliders.map((slide) => {
  //     return slide.subCategory.map(
  //       (ele) => ele.price - ele.productDiscountedPrice
  //     );
  //   });
  // props.product.price - props.product.productDiscountedPrice;
  //   const percentage = Math.floor(
  //     (props.product.productDiscountedPrice / props.product.price) * 100
  //   );

  //   const percentage = Math.floor(
  //     sliders.map((slide) => {
  //       return slide.subCategory.map(
  //         (ele) => (ele.productDiscountedPrice / ele.price) * 100
  //       );
  //     })
  // (props.product.productDiscountedPrice / props.product.price) * 100
  //   );
  //   console.log(
  //     'object',
  //     sliders.map((slide) => {
  //       return slide.subCategory.map((ele) => ele);
  //     })
  //   );

  const _slider = sliders.map((slide) => {
    return slide.subCategory.map((ele) => ele);
  });
  // console.log(
  //   'object',
  //   _slider.map((ele) => ele[0]._id)
  // );

  //   const _slider1 = _slider[0].map((ele) => ele);
  //   console.log('object', _slider1);

  const addToCartHandler = async (item) => {
    const _Slider = item.map((ele) => ele[0]._id);
    console.log(_Slider);
    // const _item = item.map((ele) => ele);
    // const ic = _item[0].map((ele) => ele.id);
    // console.log(ic);
    //   const productId = sliders.map((slide) => {
    //     return slide.subCategory.map((ele) => ele._id);
    //   });
    const existItem = cartItems.find((x) => x._id === sliders._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/sliders/${_Slider}`);
    console.log('data', data);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  console.log(sliders);

  return (
    <div>
      <h1>Products</h1>
      <div className="products">
        {sliders.map((slide) => {
          console.log(slide.subCategory[0]);
          return slide.subCategory.map((ele) => (
            <div className="product">
              <Card style={{ background: '#f8f9fa', width: '300px' }}>
                <Link to={`/sliders/${ele.slug}`}>
                  <img
                    src={ele.image}
                    className="card-img-top"
                    alt={ele.name}
                    style={{ height: '261px' }}
                  />
                </Link>
                <Card.Body>
                  <Link to={`/sliders/${ele.slug}`}>
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
                    <Button onClick={() => addToCartHandler(_slider)}>
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
          ));
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

export default function Product(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === props.product._id);
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
  };
  const discountPrice =
    props.product.price - props.product.productDiscountedPrice;
  const percentage = Math.floor(
    (props.product.productDiscountedPrice / props.product.price) * 100
  );
  // console.log('in side product', state.userInfo?.isAdmin);
  return (
    <Card>
      <Link to={`/product/${props.product.slug}`}>
        <img
          src={props.product.image}
          className="card-img-top"
          alt={props.product.name}
          style={{ height: '261px' }}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${props.product.slug}`}>
          <Card.Title>{props.product.name}</Card.Title>
        </Link>
        <Rating
          rating={props.product.rating}
          numReviews={props.product.numReviews}
        />
        <Card.Text>
          <div style={{ display: 'flex' }}>
            <div style={{ fontSize: '30px' }}> Rs.{discountPrice} </div>
            <div style={{ textDecoration: 'line-through', margin: '10px' }}>
              {' '}
              Rs.{props.product.price}
            </div>
            <div style={{ margin: 'auto' }}>({percentage}% off)</div>
          </div>
        </Card.Text>
        {props.product.countInStock === 0 ? (
          state?.userInfo?.isAdmin ? null : (
            <Button variant="light" disabled>
              Out of stock
            </Button>
          )
        ) : state?.userInfo?.isAdmin ? null : (
          <Button onClick={() => addToCartHandler(props.product)}>
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

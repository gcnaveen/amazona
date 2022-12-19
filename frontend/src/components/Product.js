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
  return (
    <Card>
      <Link to={`/product/${props.product.slug}`}>
        <img
          src={props.product.image}
          className="card-img-top"
          alt={props.product.name}
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
        <Card.Text>Rs.{props.product.price}</Card.Text>
        {props.product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(props.product)}>
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

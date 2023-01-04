import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import OrderSort from '../components/OrderSort';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        // filter_orders: [...action.payload],
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};
export default function OrderListScreen() {
  // const { search } = useLocation();
  // const sp = new URLSearchParams(search); // /search?category=Shirts
  // const category = sp.get('category') || 'all';
  // const query = sp.get('query') || 'all';
  // const price = sp.get('price') || 'all';
  // const order = sp.get('order') || 'newest';
  // const page = sp.get('page') || 1;
  // const { search } = useLocation();
  // const sp = new URLSearchParams(search); // /search?category=Shirts
  // const users = sp.get('users') || 'all';
  // const products = sp.get('products') || 'all';
  const [data, setData] = useState([]);
  const [sort, setSort] = useState('highest');
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  console.log('orders', orders);
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);
  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('order deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };
  useEffect(() => {
    const sortArray = () => {
      if (sort === 'highest') {
        const sorted = orders?.sort(function (a, b) {
          if (a.totalPrice > b.totalPrice) return 1;
          if (b.totalPrice > a.totalPrice) return -1;
          return 0;
        });
        setData(sorted);
        console.log(sort);
      } else if (sort === 'lowest') {
        const sorted = orders?.sort(function (a, b) {
          if (b.totalPrice > a.totalPrice) return 1;
          if (a.totalPrice > b.totalPrice) return -1;
          return 0;
        });
        setData(sorted);
        console.log(sort);
      }
    };

    sortArray(sort);
  }, [orders, sort]);

  // console.log('data', data);
  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      <div>
        <form action="#">
          <label htmlFor="sort"></label>
          <select
            onChange={(e) => setSort(e.target.value)}
            // onClick={sorting}
          >
            <option value="lowest">Price: low to high</option>
            <option value="#" disabled></option>
            <option value="highest"> Price: high to low</option>
          </select>
        </form>
      </div>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>USER</th>
              <th>ORDERED DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>DELIVERED DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((order) => (
              <tr key={order._id}>
                <td>
                  <img
                    src={order?.orderItems?.map((a) => a.image)}
                    alt=""
                    className="orders-img"
                  />
                </td>
                <td>{order.user ? order.user.name : 'DELETED USER'}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>{order.isDelivered ? 'Yes' : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No Yet Delivered'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(order)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

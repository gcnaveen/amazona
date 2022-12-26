import { useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function PasswordForm() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      toast.error('Passwords do not match');
      return;
    }
    console.log(otp, password);
    try {
      const { data } = await Axios.post('/api/users/change-password', {
        otp,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
      console.log('data', data);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="otp">
          <Form.Label>Otp</Form.Label>
          <Form.Control
            type="otp"
            maxLength="4"
            required
            onChange={(e) => {
              setOtp(e.target.value);
            }}
          />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="cpassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="cpassword"
            required
            onChange={(e) => {
              setCpassword(e.target.value);
            }}
          />
        </Form.Group> */}
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <Form.Group className="mb-3" controlId="cpassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={(e) => {
                setCpassword(e.target.value);
              }}
            />
          </Form.Group>
        </Form.Group>
      </Form>
      <div className="mb-3">
        <Button type="submit">Change Password</Button>
      </div>
    </Container>
  );
}

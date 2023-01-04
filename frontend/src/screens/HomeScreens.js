import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Slider from '../components/SliderScreens/Slider';
import { Helmet } from 'react-helmet-async';
// import { LeftArrow, RightArrow } from '../components/arrows';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { FreeMode } from 'swiper';
// import 'swiper/css';
// import 'swiper/css/free-mode';
// import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function HomeScreens() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);
  console.log('pro', products);
  return (
    <div>
      <Helmet>
        <title>Amazon</title>
      </Helmet>
      <div style={{ marginBotton: '20px', width: '650px' }}>
        <Slider />
      </div>

      <div className="products" style={{ paddingTop: '30px' }}>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          // <ScrollMenu
          //   // Header={<div>HEADER</div>}
          //   // Footer={<div>FOOTER</div>}
          //   LeftArrow={LeftArrow}
          //   RightArrow={RightArrow}
          //   // onWheel={onWheel}
          // >
          <Row>
            {products.map((product) => {
              return (
                <Col
                  key={product.slug}
                  sm={6}
                  md={4}
                  lg={3}
                  className="md-3"
                  style={{ paddingBottom: '10px' }}
                >
                  <Product product={product} />

                  {/* <HorizontalScroll> */}

                  {/* </HorizontalScroll> */}
                </Col>
              );
            })}
          </Row>
          // </ScrollMenu>
        )}
      </div>
    </div>
  );
}

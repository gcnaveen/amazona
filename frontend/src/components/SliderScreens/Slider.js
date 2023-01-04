import Carousel from 'react-bootstrap/Carousel';
import React, { useEffect, useReducer, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import LoadingBox from '../LoadingBox';
import MessageBox from '../MessageBox';

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

function Slider() {
  const [index, setIndex] = useState(0);
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

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  // console.log(sliders);
  return (
    <Carousel
      style={{ height: '300px', width: '1100px' }}
      activeIndex={index}
      onSelect={handleSelect}
    >
      {sliders.map((slide) => {
        return (
          <Carousel.Item style={{ height: '300px' }}>
            <Row>
              <Col className="hero__section">
                <Link to={`/slider`}>
                  <img
                    className="d-block w-100"
                    src={slide.image}
                    alt={slide.name}
                    width="400"
                    height="400"
                    style={{
                      display: 'block',
                      maxHeight: '350px',
                      maxWidth: '1100px',
                      width: 'auto',
                      height: 'auto',
                    }}
                  />
                </Link>
                {/* <img
                  className="d-block w-100"
                  src={slide.image}
                  alt={slide.name}
                  width="400"
                  height="400"
                  style={{
                    display: 'block',
                    maxHeight: '350px',
                    maxWidth: '1100px',
                    width: 'auto',
                    height: 'auto',
                  }}
                /> */}
                <Col>
                  <Carousel.Caption style={{ paddingRight: '630px' }}>
                    {/* <p> Trending product in this year </p>\
                  <h2>Limited time offer </h2> */}
                    {/* <motion.button
                      whileTap={{ scale: 1.2 }}
                      className="buy__btn"
                    >
                      {' '}
                      <Link to={`/slider`} style={{ color: 'white' }}>
                        {' '}
                        Shop Now{' '}
                      </Link>{' '}
                    </motion.button> */}
                    {/* <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p> */}
                  </Carousel.Caption>
                </Col>
              </Col>
            </Row>
            {/* <img
              // className="d-block w-100"
              src={slide.image}
              alt={slide.name}
              // style={{ height: '300px' }}
            /> */}
          </Carousel.Item>
        );
      })}

      {/* <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://www.creatopy.com/blog/wp-content/uploads/2018/11/sportsware-slider-example-1024x495.png"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://www.creatopy.com/blog/wp-content/uploads/2018/11/responsove-image-slider-example-1024x552.png"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item> */}
    </Carousel>
  );
}

export default Slider;
// import React, { useEffect, useReducer, useState } from 'react';
// import Container from 'react-bootstrap/esm/Container';
// import Row from 'react-bootstrap/esm/Row';
// import Col from 'react-bootstrap/esm/Col';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import LoadingBox from '../LoadingBox';
// import MessageBox from '../MessageBox';
// import Carousel from 'react-bootstrap/Carousel';

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'FETCH_REQUEST':
//       return { ...state, loading: true };
//     case 'FETCH_SUCCESS':
//       return { ...state, sliders: action.payload, loading: false };
//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };

// export default function Slider() {
// const [{ loading, error, sliders }, dispatch] = useReducer(reducer, {
//   sliders: [],
//   loading: true,
//   error: '',
// });
//   const [index, setIndex] = useState(0);
//   const handleSelect = (selectedIndex, e) => {
//     setIndex(selectedIndex);
//   };
// useEffect(() => {
//   const fetchData = async () => {
//     dispatch({ type: 'FETCH_REQUEST' });
//     try {
//       const result = await axios.get('/api/sliders');
//       dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
//     } catch (err) {
//       dispatch({ type: 'FETCH_FAIL', payload: err.message });
//     }
//   };
//   fetchData();
// }, []);
//   console.log('object', sliders);
//   return (
//     <section className="hero__section">
// {loading ? (
//   <LoadingBox />
// ) : error ? (
//   <MessageBox variant="danger">{error}</MessageBox>
// ) : (
//         <Container>
//           <Row style={{ width: '1100px' }}>
//             <Carousel activeIndex={index} onSelect={handleSelect}>
//               <Carousel.Item
//                 style={{ display: 'flex' }}
//                 // style={{ width: '850px' }}
//               >
//                 <Col lg="6" md="6" style={{ width: '300px' }}>
//                   <div className="hero__content">
// <p
//   className="hero__subtitle"
//   style={{ paddingTop: '30px' }}
// >
//   {' '}
//   Trending product in this year{' '}
// </p>
//                     <h2>Limited time offer </h2>

// <motion.button
//   whileTap={{ scale: 1.2 }}
//   className="buy__btn"
// >
//   {' '}
//   <Link to={`/slider`} style={{ color: 'white' }}>
//     {' '}
//     Shop Now{' '}
//   </Link>{' '}
// </motion.button>
//                   </div>
//                 </Col>
//                 {sliders.map((slide) => {
//                   return (
//                     <Col lg="6" md="6">
//                       <img
//                         src={slide.image}
//                         alt=""
//                         // style={{ width: '800px', height: '400px' }}
//                       />
//                     </Col>
//                   );
//                 })}
//               </Carousel.Item>
//             </Carousel>
//           </Row>
//         </Container>
//       )}
//     </section>
//     // </ScrollMenu>
//   );
// }

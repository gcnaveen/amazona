import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigation,
} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreens';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import MapScreen from './screens/MapScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import Footer from './components/Footer';
import SlidingProducts from './components/SliderScreens/SlidingProducts';
import SlideProductScreen from './components/SliderScreens/SlideProductScreen';
import SliderCartScreen from './components/SliderScreens/SliderCartScreen';
import SlideListScreen from './components/SliderScreens/SlideListScreen';
import SliderEditScreen from './components/SliderScreens/SliderEditScreen';
import EditShippingAdress from './screens/EditShippingAdress';
import { NavItem } from 'react-bootstrap';
import CreateSlide from './components/SliderScreens/CreateSlide';
import CategoryWiseProductList from './screens/CategoryWiseProductList';
import { NavLink } from 'react-router-dom';
import SubMenuComp from './components/Sidebar/SubMenu';
import CreateProduct from './screens/CreateProduct';
import CreateCateogry from './screens/CreateCateogry';
// import swal from 'sweetalert';

function App() {
  const { state, dispatch: ctxDispatch, getInitialValues } = useContext(Store);
  const { fullBox, cart, userInfo } = state;
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    // localStorage.removeItem('cartItems');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/getAllCats`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };

    fetchCategories();
  }, [state]);

  // console.log('user', state);

  // const brandHandler = (userInfo) => {
  //   if (userInfo && userInfo?.length) {
  //     let list = [];
  //     listItems?.forEach((item, index) => {
  //       if (item?.brand?.toLowerCase() === brand?.toLowerCase()) {
  //         list.push(item);
  //       }
  //     });
  //     setUpdatedList(list);
  //   }
  // };
  // console.log('userInfo', userInfo);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
            ? 'site-container d-flex flex-column full-box'
            : 'site-container d-flex flex-column'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar
            variant="dark"
            style={{ backgroundColor: '#221b68' }}
            expand="lg"
          >
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>

              <LinkContainer to="/">
                <Navbar.Brand style={{ color: 'white' }}>
                  {/* <img
                    src="https://www.betonamit.com/wp-content/uploads/2020/09/amazon-logo-header-300x188.jpg"
                    alt=""
                    style={{ width: 'auto', height: '40px' }}
                  /> */}
                  MedsShop
                </Navbar.Brand>
              </LinkContainer>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />

                <Nav className="me-auto  w-100  justify-content-end">
                  {userInfo && userInfo.isAdmin ? null : userInfo === null ? (
                    <Link to="/signin" className="nav-link">
                      <i
                        className="fas fa-shopping-cart"
                        style={{ color: 'white' }}
                      ></i>
                      Cart
                    </Link>
                  ) : (
                    <Link
                      to="/cart"
                      className="nav-link"
                      style={{ color: 'white' }}
                    >
                      <i
                        className="fas fa-shopping-cart"
                        style={{ color: 'white' }}
                      ></i>
                      Cart
                      {cart.cartItems.length > 0 &&
                        (userInfo ? (
                          <Badge pill bg="danger">
                            {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                          </Badge>
                        ) : null)}
                    </Link>
                  )}

                  {userInfo && userInfo?.isAdmin ? (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/sliders">
                        <NavDropdown.Item>Slides</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>Admin Profile</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : userInfo ? (
                    <div>
                      <NavDropdown
                        style={{ color: 'white' }}
                        title={userInfo.name}
                        id="basic-nav-dropdown"
                      >
                        <LinkContainer to="/profile">
                          <NavDropdown.Item>User Profile</NavDropdown.Item>
                        </LinkContainer>

                        <LinkContainer to="/orderhistory">
                          <NavDropdown.Item>Order History</NavDropdown.Item>
                        </LinkContainer>

                        <NavDropdown.Divider />
                        <Link
                          className="dropdown-item"
                          to="#signout"
                          onClick={signoutHandler}
                        >
                          Sign Out
                        </Link>
                      </NavDropdown>
                    </div>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      <i className="fas fa-user"></i>
                      Sign In
                    </Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div className="catagory-div">
          {/* // <NavItem key={i}>{ category}</NavItem> */}

          {categories.map((category, i) => (
            <Nav.Item className="category-main-container" key={category.slug}>
              <NavLink
                to={`/products/categories?type=category&name=${category.slug}`}
                style={{
                  textDecoration: 'none',
                  color: '#363075',
                  fontSize: '18px',
                }}
              >
                {category.name}
              </NavLink>
              <div className="sub-category-div">
                {category?.subCategory &&
                  category.subCategory.map((item, i) => (
                    <NavLink
                      key={i}
                      to={`/products/categories?type=subCategory&name=${item.slug}`}
                      className="sub-menu-item"
                      style={{ textDecoration: 'none', color: 'white' }}
                    >
                      {item.name}
                    </NavLink>
                  ))}
              </div>
            </Nav.Item>
          ))}
        </div>
        {/* <div>
          {' '}
          {categories.map((category) => (
            <Nav.Item key={category}>
              <LinkContainer
                to={`/search?category=${category}`}
                onClick={() => setSidebarIsOpen(false)}
              >
                <Nav.Link>{category}</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          ))}
        </div> */}
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            <div className="side-bar-nav">
              {categories.map((category, i) => (
                // <NavItem key={i}>{ category}</NavItem>
                <SubMenuComp key={category.slug} category={category} />
              ))}
            </div>
          </Nav>
        </div>
        <main style={{ overflowX: 'hidden' }}>
          <Container className="mt-3" style={{ overflowX: 'hidden' }}>
            <Routes>
              <Route
                path="/products/categories"
                element={<CategoryWiseProductList />}
              />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/reset-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>{' '}
              <Route
                path="/adress-edit/:id"
                element={<EditShippingAdress />}
              ></Route>
              <Route path="/search" element={<SearchScreen />} />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
              {/* slide Route */}
              <Route
                path="/slider/:sliderID"
                element={
                  <ProtectedRoute>
                    <SlidingProducts />
                  </ProtectedRoute>
                }
              />
              <Route path="/carts" element={<SliderCartScreen />} />
              <Route path="/sliders/:slug" element={<SlideProductScreen />} />
              <Route
                path="/admin/sliders"
                element={
                  <AdminRoute>
                    <SlideListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/sliders/createSlide"
                element={
                  <AdminRoute>
                    <CreateSlide />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/sliders/:id"
                element={
                  <AdminRoute>
                    <SliderEditScreen />
                  </AdminRoute>
                }
              ></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/createCategory"
                element={
                  <AdminRoute>
                    <CreateCateogry />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/createProduct"
                element={
                  <AdminRoute>
                    <CreateProduct />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center " style={{ paddingTop: ' 10px' }}>
            <Footer />
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
export default App;

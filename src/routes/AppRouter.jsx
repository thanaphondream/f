import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import LoginForm from '../layout/LoginForm'
import RegisterForm from '../layout/RegisterForm'
import useAuth from '../hooks/useAuth'
import Header from '../layout/Header'
import UserHome from '../layout/UserHome'
// import NewTodoForm from '../layout/NewTodoForm'
import HeaderAdmin from '../layout/HeaderAdmin'
import Typegames from '../layout/TypeGame'
import Customer from '../layout/Customer'
import NewProduct from '../layout/CreateProduct'
import GameDetail from '../layout/gameDetail'
import CreatePoint from '../layout/CreatePonit'
import History from '../layout/History'
import Profile from '../layout/Proflie'
import Updateprofile from '../layout/UpdateProfile'
import Payment from '../layout/Payment'
import Test from '../layout/test'
import OrderAdmin from '../layout/OrderAdmin'
import EditAdmin from '../layout/EditAdmin'
import Orderstatus01 from '../layout/Orderstatus01'
import OrderCencal from '../layout/OrderCencal'

const guestRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      { index: true, element: <UserHome /> },
      { path: '/userhome', element: <UserHome />},
      { path: '/register', element: <RegisterForm />},
      { path: '/login', element: <LoginForm />},
      { path: '/test/:gametypeId', element: <Test /> },
      { path: '/getproduct/:id', element: <GameDetail /> },
    ]
  }
])

const userRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children : [
      { index: true, element: <UserHome /> },
      { path: '/getproduct/:id', element: <GameDetail /> },
      { path: '/profile', element: <Profile /> },
      { path: '/Updateprofile', element: <Updateprofile /> },
      { path: '/history', element: <History /> },
      { path: '/payment', element: <Payment /> },
      { path: '/test/:gametypeId', element: <Test /> },
    ]
  }
])


const adminRouter = createBrowserRouter([
  {
    path:'/',
    element:(
    <>
    <HeaderAdmin />
      <Outlet/>
    </>
    ),
    children:[
      {index: true, element:<UserHome/>},
      {path: "/home", element:<UserHome/>},
      { path : '/editadmin', element: <EditAdmin /> },
      { path : '/newpro', element: <NewProduct /> },
      {path: '/customer', element:<Customer />},
      {path: '/typegames', element:<Typegames />},
      {path: '/createpoint', element:<CreatePoint />},
      {path: '/orderadmin', element:<OrderAdmin />},
      { path: '/orderstatus01', element: <Orderstatus01/>},
      { path: '/ordercencal', element: <OrderCencal/> },
      // {path: '/pointGame', element:<GamePointsAdmin />},
 
    ]
  }
])

export default function AppRouter() {
  const {user} = useAuth()
  const finalRouter = user?.id ? user.role ==='ADMIN'? adminRouter: userRouter : guestRouter
  return (
    <RouterProvider router={finalRouter} />
  )
}
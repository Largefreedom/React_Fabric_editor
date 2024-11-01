import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// import App from './App.jsx'
import Root from "./routes/root.jsx";
import ErrorPage from './error-page.jsx';
import Contact from './contact.jsx';
import Upload from './upload.jsx';
import ExpandImg from './page/img/expandImg.jsx';
import ImgEditor from './page/editor/imgEditor.jsx';
import ImgCover from './page/utils/imgCover.jsx';
import DataTransfer from './page/dataTransfer/dataTransfer.jsx';
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createBrowserRouter, RouterProvider, useNavigate} from 'react-router-dom'
const router = createBrowserRouter([
  {
    path: '/',
    element:<Root></Root>,
    errorElement: <ErrorPage/>
  },
  {
    path: 'contacts/:contactId',
    element: <Contact></Contact>
  },

  {
    path: 'utils/data-transfer',
    element: <DataTransfer></DataTransfer>
  },

  {
    path: 'img/img-editor',
    element: <ImgEditor></ImgEditor>
  },
  {
    path: 'img/seg-person',
    element: <Upload></Upload>
  },
  {
    path: 'img/expand-img',
    element: <ExpandImg></ExpandImg>  
  },
  {
    path: 'utils/img-cover',
    element: <ImgCover></ImgCover>
  }
])


createRoot(document.getElementById('root')).render(
  

  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>,
)

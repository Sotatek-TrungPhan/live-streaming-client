import ConfigProvider from 'antd/es/config-provider'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {

  return (
    <ConfigProvider>
        <RouterProvider router={router}/>
    </ConfigProvider>
  )
}

export default App

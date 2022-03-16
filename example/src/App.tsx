import React from 'react'

import {CheeseBoard} from 'cheeseboard-core'
import { RecoilRoot } from 'recoil'

import 'cheeseboard-core/dist/index.css'

const App = () => {
  return <RecoilRoot>
    <React.StrictMode>
      <CheeseBoard/>
    </React.StrictMode>
  </RecoilRoot>
}

export default App; 

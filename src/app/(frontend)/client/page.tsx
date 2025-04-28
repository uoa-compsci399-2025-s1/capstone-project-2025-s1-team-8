import React, { Suspense } from 'react'
import NewComponent from './new-component'
import Loading from './loading'

export default function Client() {
  return <div>This is the client page
    <h1 style={{fontSize: "50px"}}>SOME TITLE</h1>
    <Suspense fallback={<Loading />}>
      <NewComponent />
    </Suspense></div>
}

import {useEffect, useState} from 'react'
import dbRef from '../Firebase/firebase'

const useFirebaseGet = (firebaseHandlesAndRequests, keyUpdate="") => {

  useEffect(()=>{

      firebaseHandlesAndRequests.forEach(handleAndRequest =>{
        dbRef.child(handleAndRequest.request).on("value",
          snapshot => {
            handleAndRequest.handleResponse(snapshot.val())
            if(handleAndRequest.handleFinaly)handleAndRequest.handleFinaly()
          },
          error => {
            handleAndRequest.handleError(error)
            if(handleAndRequest.handleFinaly)handleAndRequest.handleFinaly()
          }
        )
      })

      return () => {
        firebaseHandlesAndRequests.forEach(handleAndRequest =>{
          dbRef.child(handleAndRequest.request).off("value")
        })
      }
  }, [keyUpdate])

  return null

}

export default useFirebaseGet

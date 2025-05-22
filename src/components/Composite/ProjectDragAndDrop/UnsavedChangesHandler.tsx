'use client'

import { useEffect, useCallback } from 'react'

const useUnsavedChangesWarning = (hasChanges: boolean) => {
  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (hasChanges) {
        event.preventDefault()
        return ''
      }
    },
    [hasChanges],
  )

  useEffect(() => {
    // Add the event listener when the component mounts and hasChanges is true
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasChanges, handleBeforeUnload])
}

export default useUnsavedChangesWarning

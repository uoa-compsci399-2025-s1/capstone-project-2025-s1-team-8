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

  useEffect(() => {
    if (hasChanges) {
      // Add a dummy history entry to trigger a popstate event when user hits back/forward
      window.history.pushState(null, '', window.location.href)

      const handlePopstate = (event: PopStateEvent) => {
        if (hasChanges) {
          const confirmation = window.confirm(
            'You have unsaved changes. Are you sure you want to leave?',
          )
          if (!confirmation) {
            // Re-push the current state to prevent the navigation
            window.history.pushState(null, '', window.location.href)
          }
        }
      }

      window.addEventListener('popstate', handlePopstate)
      return () => {
        window.removeEventListener('popstate', handlePopstate)
      }
    }
  }, [hasChanges])
}

export default useUnsavedChangesWarning

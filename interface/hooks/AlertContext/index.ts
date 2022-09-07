import { createContext, Dispatch, useState, useContext, useMemo } from 'react'

type AlertState = {
  alert: Alert | undefined
  setAlert: Dispatch<Alert | undefined> | undefined
}

const initialize: AlertState = {
  alert: undefined,
  setAlert: undefined,
}

const AlertContext = createContext(initialize)

const useAlertContext = () => useContext(AlertContext)

const useAlertProvider = () => {
  const [alert, setAlert] = useState(initialize.alert)

  useMemo(() => {
    setAlert(alert)
  }, [alert])

  return { alert, setAlert } as AlertState
}

export { AlertContext, useAlertProvider, useAlertContext }

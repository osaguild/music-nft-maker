import { FunctionComponent, useMemo } from 'react'
import { Alert as ChakraAlert, AlertIcon } from '@chakra-ui/react'
import { useAlertContext } from '../../hooks/AlertContext'

const Alert: FunctionComponent = () => {
  const { alert, setAlert } = useAlertContext()

  useMemo(() => {
    if (alert && setAlert) setTimeout(() => setAlert(undefined), 5000)
  }, [alert, setAlert])

  return alert ? (
    <ChakraAlert status={alert?.status}>
      <AlertIcon />
      {alert?.message}
    </ChakraAlert>
  ) : (
    <></>
  )
}

export { Alert }

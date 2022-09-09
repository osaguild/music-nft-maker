import { useState, useEffect } from 'react'

const usePortfolio = () => {
  const [total, setTotal] = useState<number>()
  const [stake, setStake] = useState<number>()
  const [sale, setSale] = useState<number>()

  useEffect(() => {
    setTotal(120)
    setStake(110)
    setSale(10)
  }, [])

  return { total, stake, sale }
}

export { usePortfolio }

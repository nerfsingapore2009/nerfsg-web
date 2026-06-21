import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} | NerfSG`
      : 'NerfSG | Singapore Nerf Community'
  }, [title])
}

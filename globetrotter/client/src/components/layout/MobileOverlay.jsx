import { useDispatch } from 'react-redux'
import { setMobileMenu } from '../../store/slices/uiSlice.js'

export default function MobileOverlay() {
  const dispatch = useDispatch()
  return (
    <div
      className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
      onClick={() => dispatch(setMobileMenu(false))}
    />
  )
}

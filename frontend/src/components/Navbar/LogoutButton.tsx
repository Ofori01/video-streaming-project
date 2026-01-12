import React from 'react'
import { Button } from '../ui/button'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/auth/authSlice'

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
  }
  return (
    <Button onClick={handleLogout}>Logout</Button>
  )
}

export default LogoutButton


import React from 'react'
import Logo from '../assets/react.svg'
const Navbar : React.FC = () => {
  return (
    <nav>
        <img src={Logo} />
      <ul>
        <li>Home</li>
      </ul>
      <button>Get Started</button>
    </nav>
  )
}

export default Navbar

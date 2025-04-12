import React from 'react'

type ButtonColor = {
  color: 'light' | 'dark'
}

const Button: React.FC<ButtonColor> = ({ color }) => {
  const lightColor = 'bg-white text-black'
  const darkColor = 'bg-black text-white'
  return <button className={`${color == 'light' ? lightColor : darkColor}`}>Click here</button>
}
export default Button

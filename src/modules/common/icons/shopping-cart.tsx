import React from "react"
import { IconProps } from "types/icon"

const ShoppingCart: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M9 2L7 6H3C2.44772 6 2 6.44772 2 7V19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19V7C22 6.44772 21.5523 6 21 6H17L15 2H9Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle
        cx="9"
        cy="13"
        r="1.5"
        fill={color}
      />
      <circle
        cx="15"
        cy="13"
        r="1.5"
        fill={color}
      />
      <path
        d="M7 12H17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default ShoppingCart
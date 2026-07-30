import React from "react";

export default function DashedBorder(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        width="calc(100% - 2px)"
        height="calc(100% - 2px)"
        x="1"
        y="1"
        rx="16"
        ry="16"
      />
    </svg>
  );
}

const Rotate = ({ className, size, color, ...props }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || "15"}
    height={size || "19"}
    fill="none"
    viewBox="0 0 15 19"
    className={className}
    {...props}
  >
    <path
      fill={color || "#FFF8FF"}
      d="M8.914 2.975a.5.5 0 0 0 0-.707L6.793.146a.5.5 0 0 0-.707.708l.997.996a7.5 7.5 0 0 0-4.075 13.495.5.5 0 1 0 .6-.8A6.5 6.5 0 0 1 7.566 2.84q.038 0 .073-.005L6.086 4.39a.5.5 0 1 0 .707.707zM6.086 15.703a.5.5 0 0 0 0 .707l2.121 2.121a.5.5 0 1 0 .707-.707l-.997-.997a7.5 7.5 0 0 0 4.075-13.495.5.5 0 1 0-.6.8q.369.276.704.61a6.5 6.5 0 0 1-4.662 11.096 1 1 0 0 0-.074.005l1.554-1.554a.5.5 0 1 0-.707-.707z"
    ></path>
  </svg>
);

export default Rotate;

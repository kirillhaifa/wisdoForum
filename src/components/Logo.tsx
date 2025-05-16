const Logo = ({ width = 60, height = 60 }: { width?: number; height?: number }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke="#7143FF"
      strokeLinecap="round"
      strokeWidth="3.645"
      d="m20.093 28.951-3.504 5.972c-.562.788-1.377.747-1.877 0L2.197 11.533c-.376-.87.375-.87 1.126-.87h11.639c1.001 0 1.377.863 1.377.863l15.518 26.756c.626 1.12 1.877 1.244 2.628 0 0 0 17.646-32.596 18.022-33.467.375-.87-.125-1.742-1.127-1.742H34.11c-.376 0-1.252.125-1.877 1.244L26.6 15.39"
    />
  </svg>
);

export default Logo;

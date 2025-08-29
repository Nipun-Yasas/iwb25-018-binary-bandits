interface BackgroundShapeProps {
  className?: string;
  color: string;
  opacity: number | string;
  width: number;
  height: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

const BackgroundShape: React.FC<BackgroundShapeProps> = ({
  className,
  color,
  opacity,
  width,
  height,
  cx,
  cy,
  rx,
  ry,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        position: "absolute",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={color}
        fillOpacity={+opacity}
      />
    </svg>
  );
};

export default BackgroundShape;

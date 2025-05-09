import React from "react";

export default function Icon({ name, className = "" }) {
  return (
    <img
      src={`/assets/icons/${name}.webp`}
      alt={name}
      width={80}
      height={80}
      className={className}
    />
  );
}

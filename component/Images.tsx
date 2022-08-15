import React from "react";
import styles from "../styles/Images.module.css";

interface IProps {
  images: string[];
}
export default function Images(props: IProps) {
  return (
    <div className={`${styles.container}`}>
      {props.images.map((image) => (
        <img className={`${styles.image}`} src={image} key={image} />
      ))}
    </div>
  );
}

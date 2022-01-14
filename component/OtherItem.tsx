import styles from "../styles/OtherItem.module.css";

interface IOtherItem {
  title: string;
  link?: string;
  description: string;
}

export default function OtherItem(props: IOtherItem) {
  const { title, link, description } = props;
  return (
    <div className={`${styles.otherItem} d-flex align-items-start`}>
      <h5>
        {link ? (
          <a href={link} title={title} target="_blank">
            {title}
          </a>
        ) : (
          title
        )}
      </h5>
      <span className={styles.description}>{description}</span>
    </div>
  );
}

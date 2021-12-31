import styles from "../styles/ContactItem.module.css";

interface IContactItem {
  platform: string;
  value?: string;
  link?: string;
}

export default function ContactItem(props: IContactItem) {
  const { platform, value = "", link = "" } = props;
  return (
    <div className={`${styles.contactItem} d-flex align-items-center`}>
      <div>
        <img
          className={"icon"}
          src={`../icons/${platform}.svg`}
          alt={platform}
        ></img>
      </div>
      {link ? <a href={value}>{value}</a> : <div>{value}</div>}
    </div>
  );
}

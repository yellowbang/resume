interface IExperienceItem {
  title: string;
  duration: string;
  companyName: string;
  companyLink?: string;
  address: string;
  skills?: string[];
  achievements?: string[];
}

export default function ExperienceItem(props: IExperienceItem) {
  const {
    title,
    companyName,
    companyLink,
    address,
    duration,
    skills,
    achievements,
  } = props;
  return (
    <div className="experience-item">
      <div className="title--and-duration">
        <h3 className="title">
          {title + " "}
          {companyLink ? (
            <a href={companyLink}>{companyName}</a>
          ) : (
            <span>{companyName}</span>
          )}
          <span>{" " + address + " "}</span>
          <span className="secondary-font">{duration}</span>
        </h3>
      </div>
      {skills && (
        <div className="skills pb-2">
          <i>Skills: {skills.join(" / ")}</i>
        </div>
      )}
      <ul className="achievements-list">
        {achievements &&
          achievements.map((achievement: string) => (
            <li className="achievement-item" key={achievement}>
              {achievement}
            </li>
          ))}
      </ul>
    </div>
  );
}

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
      <div className="title-and-duration d-flex justify-content-between w-100">
        <div className="d-flex flex-column align-items-start">
          <h3 className="title">{title}</h3>
          {companyLink ? (
            <a href={companyLink}><h4>{companyName}</h4></a>
          ) : (
            <h4>{companyName}</h4>
          )}
        </div>
        <div className="d-flex flex-column align-items-end">
          <span className="secondary-font">{duration}</span>
          <span>{" " + address + " "}</span>
        </div>
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

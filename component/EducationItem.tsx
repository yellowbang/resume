interface IEducationItem {
  degree: string;
  major: string;
  university: string;
  universityLink: string;
  duration: string;
}

export default function EducationItem(props: IEducationItem) {
  const { degree, major, university, universityLink, duration } = props;
  return (
    <div className="education-item">
      <span>{degree}, </span>
      <span>{major}, </span>
      <a href={universityLink}>{university}, </a>
      <span>{duration}</span>
    </div>
  );
}

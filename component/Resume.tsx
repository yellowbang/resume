import ContactItem from "../component/ContactItem";
import EducationItem from "../component/EducationItem";
import ExperienceItem from "../component/ExperienceItem";
import styles from "../styles/Resume.module.css";
import myInfo from "../public/constants/MyInfo";
import OtherItem from "../component/OtherItem";

export default function Resume() {
  return (
    <div className={styles.container}>
      <div className={`${styles.infos} d-flex flex-sm-row align-items-center`}>
        <div className={styles.education}>
          <h1>{myInfo.name}</h1>
          <div className="d-flex align-items-start">
            <img
              className={"icon"}
              src="../icons/graduate.svg"
              alt="graduate"
            />
            <div>
              {myInfo.educations.map((education) => (
                <EducationItem {...education} key={education.university} />
              ))}
            </div>
          </div>
        </div>
        <div className={`${styles.contacts} pb-sm-0 mb-sm-0`}>
          {myInfo.contacts.map((contact) => (
            <ContactItem {...contact} key={contact.platform} />
          ))}
        </div>
      </div>
      <div className={styles.experiences}>
        <h2>EXPERIENCES</h2>
        {myInfo.experiences.map((experience) => (
          <ExperienceItem {...experience} key={experience.companyName} />
        ))}
      </div>
      <div className={styles.border} />
      <div className={styles.others}>
        <h2>SIDE PROJECTS AND HOBBIES</h2>
        <div className="pb-2">
          <i>Skills: {myInfo.otherSkills.join(" / ")}</i>
        </div>
        <ul>
          {myInfo.others.map((other) => (
            <li key={other.title}>
              <OtherItem {...other} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

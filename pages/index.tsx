import type { NextPage } from "next";
import ContactItem from "../component/ContactItem";
import EducationItem from "../component/EducationItem";
import ExperienceItem from "../component/ExperienceItem";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/Home.module.css";
import myInfo from "../public/constants/MyInfo";
import OtherItem from "../component/OtherItem";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className="about-me d-flex flex-row align-items-center">
        <div className={styles.education}>
          <h1 className="name">{myInfo.name}</h1>
          <div className="d-flex align-items-start">
            <img
              className={"icon"}
              src="../icons/graduate.svg"
              alt="graduate"
            />
            <div className="universities">
              {myInfo.educations.map((education) => (
                <EducationItem {...education} key={education.university} />
              ))}
            </div>
          </div>
        </div>
        <div className="contacts">
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
        <div>Skills: {myInfo.otherSkills.join(" / ")}</div>
        {myInfo.others.map((other) => (
          <OtherItem {...other} key={other.title} />
        ))}
      </div>
    </div>
  );
};

export default Home;

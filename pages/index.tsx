import { useState } from "react";
import type { NextPage } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import Resume from "../component/Resume";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

const Home: NextPage = () => {
  const [page, setPage] = useState("");
  const starCountRef = ref(db);
  onValue(starCountRef, (snapshot: any) => {
    const data = snapshot.val();
    const newPage = data.page;
    if (newPage !== page) {
      setPage(data.page);
    }
  });

  switch (page) {
    case "bolster": {
      return <div>bolster</div>;
    }
    default: {
      return <Resume />;
    }
  }
};

export default Home;

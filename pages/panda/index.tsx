import { useEffect } from "react";
import { useRouter } from "next/router";

const PandaIndex = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Warriors Gallery
    router.push("/panda/WarriorsGallery");
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #1f3a93 0%, #ffc72c 100%)",
        color: "#fff",
        fontSize: "18px",
      }}
    >
      Loading Warriors Gallery Museum...
    </div>
  );
};

export default PandaIndex;

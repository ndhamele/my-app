import * as React from "react";
import "./styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import DalleImage from "./DALL_E_2.png";

// adding a image scrolling effect
interface MediaCardProps {
  title: string;
  image: string[];
  description: string;
  courseCode: string;
  instructor: string;
}

const MediaCard: React.FC<MediaCardProps> = ({
  title,
  image,
  description,
  courseCode,
  instructor,
}) => {
  const navigate = useNavigate();

  const handleSelect = (courseCode: string) => {
    console.log("handleSelect");
    navigate(`/assignments/${courseCode}`);
  };
  const handleCardClick = () => {
    // Pass the courseCode here
    handleSelect(courseCode);
  };

  return (
    <div
      className="d-inline-flex card m-4 shadow-lg"
      style={{ width: "18rem", height: "24rem" }}
      onClick={handleCardClick}
    >
      <img src={DalleImage} className="card-img-top" alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
      </div>
    </div>
  );
};

export default MediaCard;

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './styles.css'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

// adding a image scrolling effect
interface MediaCardProps {
  title: string;
  image: string[];
  description: string;
  courseCode: string;
  instructor: string;
}


const MediaCard: React.FC<MediaCardProps> = ({ title, image, description, courseCode, instructor }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    horizontal: true,
  };

  const navigate = useNavigate();

  const handleSelect = (courseCode: string) => {
    console.log('handleSelect');
    navigate(`/assignments/${courseCode}`);
  };
  const handleCardClick = () => {
    // Pass the courseCode here
    handleSelect(courseCode);
  };
  
  return (
    <Card className="card__styles" raised={true} onClick={handleCardClick}
    sx={{ maxWidth: 345, display: 'inline-block', marginRight: '10px', borderRadius:'10px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}>
      <Slider {...settings} className="image-slider">
        {image.map((imageUrl, index) => (
          <div key={index} className="image-container">
            <img src={imageUrl} alt={title} style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '10px' }} 
            className="hover-effect" />
          </div>
        ))}
      </Slider >
      <div className="border-after-slider"></div>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        {/* click anywhere to navigate */}
      </CardActions>
    </Card>
  );
};

export default MediaCard;

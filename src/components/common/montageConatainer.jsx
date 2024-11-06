import hanjiImage from '../../assets/images/endpage_hanji.jpg'
import '../../styles/endGame.css'
import PropTypes from 'prop-types';




const MontageConatainer = ({children}) => {
  return (
    <div className="hangi" style={{backgroundImage: `url(${hanjiImage})`}}>
      <div className="hanji-words">
        <div className="hanji-count"></div>
        <div className="hanji-forbiddenWord"></div>
      </div>
      <div className="hanji-img-container"></div>
      <div className="hanji-username">{children}</div>
    </div>
  )
}

MontageConatainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MontageConatainer

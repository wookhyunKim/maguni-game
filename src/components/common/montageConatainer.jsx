import hanjiImage from '../../assets/images/endpage_hanji.jpg'
import '../../styles/endGame.css'
import PropTypes from 'prop-types';







const MontageConatainer = ({children}) => {
  return (
    <div className="hanji" style={{backgroundImage: `url(${hanjiImage})`}}>
      <>{children}</>
    </div>
  )
}

MontageConatainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MontageConatainer

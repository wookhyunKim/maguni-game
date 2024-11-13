import PropTypes from 'prop-types';

const Button = ({ 
  onClick, 
  disabled = false, 
  variant = 'red',  // 기본값을 'red'로 변경
  size = 'medium', 
  children,
  isLoading = false,
  className 
}) => {
  const getButtonStyles = () => {
    const baseStyles = 'font-bold transition-colors';
    
    const variantStyles = {
      red: 'bg-red-500 text-white hover:bg-red-600 h-10',
      black: 'bg-black text-white hover:bg-gray-800 h-10',
      round: 'border-2 border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 h-10'
    };

    const sizeStyles = {
      small: 'px-3 text-sm',
      medium: 'px-4',
      large: 'px-8 text-lg'
    };

    return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${getButtonStyles()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? '로딩중...' : children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['red', 'black', 'round', 'circle']),  // variant 옵션 변경
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  className: PropTypes.string
};

Button.defaultProps = {
  onClick: () => {},
  disabled: false,
  variant: 'red',  // 기본값 변경
  size: 'medium',
  isLoading: false,
  className: ''
};

export default Button;
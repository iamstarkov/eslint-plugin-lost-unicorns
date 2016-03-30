import './button.css';
import jsImg from './js.png';

const button = (props) => (
  <button>
    <img src={jsImg} />
    props.children
  </button>
);

export default button;

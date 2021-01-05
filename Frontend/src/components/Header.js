import React from 'react';
import {NavLink} from 'react-router-dom';


const Header = (props) => (
  <div className="header">
      <h1 className="header__title">{props.title}</h1>
      {props.subtitle && <h2 className="header__subtitle">{props.subtitle}</h2>}
      <button><NavLink to="/" activeClassName="is-active" exact={true}>Home</NavLink></button>
      <button><NavLink to="/prueba" activeClassName="is-active" >Test</NavLink></button>
  </div>
  
);

Header.defaultProps = {
  title: 'G3-COVID19-MONITOR'
};

export default Header;
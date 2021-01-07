import React from 'react';

import axios from 'axios';

class Test extends React.Component {
  state = {
    id1:''
  };

  componentDidMount() {
    axios.get(`https://us-central1-g3sopes1.cloudfunctions.net/redisFunc`)
      .then(res => {
        const id1 = res.data;
        console.log(res.data);
        //this.setState({ id1 });
      })
  }

  componentWillUnmount(){

  }


  render() {

    return (
      <div className="container">

        <h1>Prueba</h1>
       
      </div>
    );
  }
}


export default Test
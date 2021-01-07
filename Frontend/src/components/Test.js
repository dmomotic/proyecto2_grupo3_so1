import React from 'react';

import axios from 'axios';

class Test extends React.Component {
  state = {
    casos: []
  };

  componentDidMount() {
    axios.get(`https://us-central1-g3sopes1.cloudfunctions.net/redisFunc`)
      .then(res => {
        const id1 = res.data;
        console.log(res.data);
        this.setState(prevState => ({
          casos: res.data
        }))
      })
    console.log("STATE");
    console.log(this.state);
  }

  componentWillUnmount() {

  }


  render() {

    return (
      <div className="container">

        <div className="container-inline2">
          <h2>Ultimos 5 casos</h2>
          <table className="customers">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Age</th>
                <th>InfectedType</th>
                <th>state</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.casos.map((x, i) => {
                  return (
                    <tr key={i}>
                      <td >{x.name}</td>
                      <td >{x.location}</td>
                      <td >{x.age}</td>
                      <td >{x.InfectedType}</td>
                      <td >{x.state}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>


        </div>

      </div>
    );
  }
}


export default Test
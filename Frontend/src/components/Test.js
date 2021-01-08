import React from 'react';
import axios from 'axios';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';


class Test extends React.Component {
  state = {
    casos: [],
    edades:[]
  };

  componentDidMount() {
    this.getCasos();
    this.interval = setInterval(() => {
      this.getCasos();
    }, 8000);
  }

  getCasos() {
    axios.get(`https://us-central1-g3sopes1.cloudfunctions.net/redisFunc`)
      .then(res => {
        //console.log(res.data);
        const objetos = res.data.casos.map((item)=> JSON.parse(item));
        const edades= res.data.edades.map((item)=> JSON.parse(item));
        console.log(edades);
        let cantidad=[];
        cantidad[0]=0;
        cantidad[1]=0;
        cantidad[2]=0;
        cantidad[3]=0;
        cantidad[4]=0;
        cantidad[5]=0;
        cantidad[6]=0;

        for(let i=0;i<edades.length;i++){
          if(edades[i].Age >0 && edades[i].Age<=10){
            cantidad[0]=cantidad[0]+1;
          }else if(edades[i].Age >=11 && edades[i].Age<=20){
            cantidad[1]=cantidad[1]+1;
          }else if(edades[i].Age >=21 && edades[i].Age<=30){
            cantidad[2]=cantidad[2]+1;
          }else if(edades[i].Age >=31 && edades[i].Age<=40){
            cantidad[3]=cantidad[3]+1;
          }else if(edades[i].Age >=41 && edades[i].Age<=50){
            cantidad[4]=cantidad[4]+1;
          }else if(edades[i].Age >=51 && edades[i].Age<=60){
            cantidad[5]=cantidad[5]+1;
          }
        }
        let reporte4= [{
          name: '0-10', cantidad: cantidad[0]
        },
        {
          name: '11-20', cantidad: cantidad[1]
        },
        {
          name: '21-30', cantidad: cantidad[2]
        },
        {
          name: '31-40', cantidad: cantidad[3]
        },
        {
          name: '41-50', cantidad: cantidad[4]
        },
        {
          name: '51-60', cantidad: cantidad[5]
        }
      ]

        this.setState(prevState => ({
          casos: objetos,
          edades: reporte4
        }))
      })
    //console.log("STATE");
    //console.log(this.state);

  }


  componentWillUnmount() {
    clearInterval(this.interval);
  }


  render() {

    return (
      <div className="container">

        <div className="container-inline2">
          <h1>Ultimos 5 casos</h1>
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
                      <td >{x.Name}</td>
                      <td >{x.Location}</td>
                      <td >{x.Age}</td>
                      <td >{x.infected_type}</td>
                      <td >{x.State}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div >

        <br></br>
        <br></br>
        <br></br>

        <div className="container-inline2">

          <div>
          <h1>Cantidad de infectados por rango de edad</h1>
          </div>

          <div>
          <BarChart
            width={900}
            height={600}
            data={this.state.edades}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="white"/>
            <XAxis dataKey="name" stroke="white" label={{ value: "Años", fill: "white" }} />
            <YAxis stroke="white"/>
            <Tooltip />
            <Legend verticalAlign="top" height={36} iconSize={25}/>
            <Bar dataKey="cantidad" fill="#37b526" />
          </BarChart>
          </div>
          

        </div>

      </div>
    );
  }
}


export default Test
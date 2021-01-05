import React from 'react';
import { connect, consulta2, adios } from '../connection/api';
import {
  PieChart, Pie, Sector, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#7ffc03', '#03fcfc', '#fc03be', '#6f03fc', '#fc0303', '#ab4100', '#a8252e'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class Home extends React.Component {
  state = {
    fecha: "",
    consulta1: [],
    data2: [
      { name: 'Group A', value: 400 },
      { name: 'Group B', value: 300 },
      { name: 'Group C', value: 300 },
      { name: 'Group D', value: 200 },
    ],
    data: [],

  };




  componentDidMount() {

    connect((msg) => {
      this.setState(prevState => ({
        consulta1: msg
      }));
    });

    consulta2((consulta2) => {
      this.setState(prevState => ({
        data: consulta2
      }));
    });

    console.log(this.state);

  }

  componentWillUnmount() {
    adios();
  }


  render() {

    return (
      <div className="container">



        <div className="container-inline2">

          <div>
            <h1 >TOP 3 - Departamentos infectados</h1>
            <table className="customers">
              <thead>
                <tr>
                  <th>Departamento</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.consulta1.map((x, i) => {
                    return (
                      <tr key={i}>
                        <td >{x._id}</td>
                        <td >{x.count}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>

          </div>

          <div>
            <h1>Porcentaje de infectados por departamento</h1>
            <PieChart width={800} height={550}>
              <Tooltip />
              <Legend verticalAlign="top" height={36} iconSize={25} />
              <Pie
                data={this.state.data}
                cx="50%"
                cy="50%"
                outerRadius={210}
                labelLine={false}
                label={renderCustomizedLabel}
                dataKey="value">
                {
                  this.state.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))
                }
              </Pie>
            </PieChart>
          </div>


        </div>



      </div>
    );
  }
}


export default Home

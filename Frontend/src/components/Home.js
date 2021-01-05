import React from 'react';
import { connect, adios } from '../connection/api';
import {
  PieChart, Pie, Sector, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042','#7ffc03','#03fcfc','#fc03be','#6f03fc','#fc0303','#ab4100','#a8252e'];
const RADIAN = Math.PI / 180;
/*const renderCustomizedLabel = ({
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
};*/



class Home extends React.Component {
  state = {
    fecha: "",
    data2: [
      { name: 'Group A', value: 400 },
      { name: 'Group B', value: 300 },
      { name: 'Group C', value: 300 },
      { name: 'Group D', value: 200 },
    ],
    data:[]
  };



  componentDidMount() {

    connect((msg) => {
      console.log("New Message from Server: ");
      console.log(msg);
      this.setState(prevState => ({
        data: msg
      }));
      console.log(this.state);
    });
    

  }

  componentWillUnmount() {
    //const socket= socketIOClient(ENDPOINT);
    adios();

  }


  render() {

    return (
      <div className="container">

        <h1>Porcentaje de infectados por departamento</h1>

        {/* <PieChart width={400} height={400}>
        <Tooltip />
        <Legend  verticalAlign="top" height={36} iconSize={25}/>
        <Pie
          data={this.state.data}
          cx={200}
          cy={200}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#0088FE"
          dataKey="value"
        >
          {
            //this.state.data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
      </PieChart> */}

        <PieChart width={1200} height={400}>
        <Tooltip />
        <Legend  verticalAlign="top" height={36} iconSize={25}/>
          <Pie data={this.state.data} cx="50%" cy="50%" outerRadius={120} label dataKey="value">
            {
              this.state.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))
            }
          </Pie>
        </PieChart>

      </div>
    );
  }
}


export default Home

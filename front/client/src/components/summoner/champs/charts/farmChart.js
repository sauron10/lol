import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

export const FarmChart = (props) => {
  return (
    <LineChart width={350} height={250} data={props.data} >
      <CartesianGrid strokeDasharray='1 8' />
      <XAxis dataKey='name' height={35} dy={10} style={{ fill: 'white' }} />
      <YAxis style={{ fill: 'white' }} />
      <Tooltip />
      <Line type='monotone' dataKey='value' name='minions'/>
    </LineChart>
    )
}
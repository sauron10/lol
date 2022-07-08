import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

export const KdaChart = (props) => {
  return (
    <LineChart width={350} height={250} data={props.data} >
      <CartesianGrid strokeDasharray='1 8' />
      <XAxis dataKey='name' height={35} dy={10} style={{ fill: 'white' }} />
      <YAxis style={{ fill: 'white' }} />
      <Tooltip />
      <Line type='monotone' dataKey='ka' name="kill/ass" animationEasing="linear" />
      <Line type='monotone' dataKey='deaths' name="deaths"  stroke="grey" animationEasing="ease-out" />
    </LineChart>
  )
}




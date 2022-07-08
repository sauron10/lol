import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

export const WinrateChart = (props) => {
  return (
    <LineChart width={350} height={250} data={props.data} >
      <CartesianGrid strokeDasharray='1 8' />
      <XAxis dataKey='name' height={35} angle={45} dy={10} style={{ fill: 'white' }} />
      <YAxis style={{ fill: 'white' }} />
      <Tooltip formatter={(value, name, props) => [`${props.payload.name}/${value}%`, 'patch/wr']} />
      <Line type='monotone' dataKey='value' />

    </LineChart>
  )
}
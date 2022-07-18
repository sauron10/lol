import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

export const WRPatchChart = (props) => {
  return (
    <LineChart width={190} height={250} data={props.data} >
      <CartesianGrid strokeDasharray='1 8' />
      <XAxis dataKey='name' height={35} angle={45} dy={10} style={{ fill: 'white' }} />
      <YAxis style={{ fill: 'white' }} width={25} />
      <Tooltip />
      <Line type='monotone' dataKey='wr' name="winrate" animationEasing="linear" />
    </LineChart>
  )
}
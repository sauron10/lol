import { PieChart, Pie, Cell} from "recharts"

export const GamesChart = (props) => {
  return (
    <PieChart width={350} height={250}>
      <Pie
        data={props.data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        fill='grey'
        label={({name}) => name}
        // labelLine = {false}
        innerRadius='80'
        outerRadius='90'
        isAnimationActive={false}
        animationEasing='ease-in'
        >

        	{
          	props.data.map((entry, index) => <Cell key={index} fill={['#0F4C75','gray'][index]}/>)
          }
        </Pie>
    </PieChart>
  )
}
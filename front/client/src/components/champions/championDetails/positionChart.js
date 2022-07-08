// import { VictoryPie } from "victory";
import { PieChart, Pie } from "recharts"

export const RoleChart = props => {
  return (
    // <VictoryPie animate={{ duration: 500, onLoad: { duration: 500 } }}
    //   colorScale={['green', 'red']}
    //   innerRadius={130}
    //   cornerRadius={50}
    //   data={props.victoryData}
    //   labelRadius={30}
    //   padAngle={5}
    //   style={{
    //     labels: {
    //       fill: 'white',
    //       fontSize: 30
    //     }
    //   }}
    // />
    <PieChart width={350} height={250}>
      <Pie
        data={props.data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        fill='gray'
        label={({name}) => name}
        // labelLine = {false}
        innerRadius='80'
        outerRadius='90'
        isAnimationActive={false}
        animationEasing='ease-in'
        />
    </PieChart>
  )
}
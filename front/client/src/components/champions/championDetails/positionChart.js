import { VictoryPie } from "victory";

export const RoleChart = props => {
  return(
    <VictoryPie animate={{ duration: 500, onLoad: { duration: 500 } }}
      colorScale={['green', 'red']}
      innerRadius={130}
      cornerRadius={50}
      data={props.victoryData}
      labelRadius={30}
      padAngle={5}
      style={{
        labels: {
          fill: 'white',
          fontSize: 30
        }
      }}
    />
  )
}
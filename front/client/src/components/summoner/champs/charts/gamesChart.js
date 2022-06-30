import { VictoryPie } from "victory"

export const GamesChart = (props) => {
  return (
    <VictoryPie
      colorScale={['purple', 'blue', 'red']}
      innerRadius={135}
      cornerRadius={70}
      data={props.victoryData}
      labelRadius={160}
      labelPlacement = {'perpendicular'}
      
      padAngle={1}
      style={{
        labels: {
          fill: 'white',
          fontSize: 25
        }
      }}
    />
  )
}
import { VictoryAxis,VictoryGroup,VictoryChart,VictoryVoronoiContainer,VictoryTooltip,VictoryScatter,VictoryLine } from "victory"

export const WinrateChart = (props) => {
  return (
    <VictoryChart
      containerComponent={
        <VictoryVoronoiContainer voronoiDimension="x"
          labels={({ datum }) => `${datum.x}\n${datum.y}%`}
          labelComponent={<VictoryTooltip cornerRadius={10} flyoutStyle={{ fill: "white" }} />}
          voronoiBlacklist={['scat']}
        />
      }
    >
      <VictoryAxis style={{ axis: { stroke: 'white' } ,axisLabel:{fontSize:20} }} label={'Winrate by patch'} tickFormat={(x)=>''}  />
      <VictoryAxis dependentAxis style={{ axis: { stroke: 'white' }, tickLabels: { fill: 'white' } }} />
      <VictoryGroup data={props.data}>
        <VictoryScatter name='scat' style={{ data: { strokeWidth: 4, stroke: 'white', fill: 'transparent' } }} />
        <VictoryLine name="ka" style={{ data: { stroke: "white" }, labels: { fill: 'green' } }} />
      </VictoryGroup>
    </VictoryChart>
  )
}
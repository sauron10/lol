import { VictoryAxis, VictoryGroup, VictoryChart, VictoryVoronoiContainer, VictoryTooltip, VictoryScatter, VictoryLine } from "victory"

export const FarmChart = (props) => {
  return (
    <VictoryChart
      containerComponent={
        <VictoryVoronoiContainer voronoiDimension="x"
          labels={({ datum }) => `${datum.y}`}
          labelComponent={<VictoryTooltip cornerRadius={10} flyoutStyle={{ fill: "white" }} />}
          voronoiBlacklist={['scat']}
        />
      }
    >
      <VictoryAxis style={{ axis: { stroke: 'white' }, tickLabels: { fill: 'white' } }} />
      <VictoryAxis dependentAxis style={{ axis: { stroke: 'white' }, tickLabels: { fill: 'white' } }} />
      <VictoryGroup data={props.dataLists.csData}>
        <VictoryScatter name='scat' style={{ data: { strokeWidth: 4, stroke: 'white', fill: 'transparent' } }} />
        <VictoryLine name="ka" style={{ data: { stroke: "white" }, labels: { fill: 'grey' } }} />
      </VictoryGroup>
    </VictoryChart>
  )
}
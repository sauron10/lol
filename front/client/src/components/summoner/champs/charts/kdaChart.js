import { VictoryAxis,VictoryGroup,VictoryChart,VictoryVoronoiContainer,VictoryTooltip,VictoryScatter,VictoryLine } from "victory"

export const KdaChart = (props) => {
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
      <VictoryGroup data={props.dataLists.kaData}>
        <VictoryScatter name='scat' style={{ data: { strokeWidth: 4, stroke: 'green', fill: 'transparent' } }} />
        <VictoryLine name="ka" style={{ data: { stroke: "green" }, labels: { fill: 'green' } }} />
      </VictoryGroup>
      <VictoryGroup data={props.dataLists.dData} >
        <VictoryScatter name='scat' style={{ data: { strokeWidth: 4, stroke: 'red', fill: 'transparent' } }} />
        <VictoryLine name="d" style={{ data: { stroke: "red" }, labels: { fill: 'red' } }} />
      </VictoryGroup>
    </VictoryChart>
  )
}




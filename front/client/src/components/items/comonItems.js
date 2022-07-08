import { useEffect } from "react"
import { useItems } from "./itemDetails"
import { Item } from "../summoner/item"

export const CommonItems = (props) => {
  
  const {items,loaded,getCommonItemsChampion} = useItems()

  useEffect(() => {
    getCommonItemsChampion(props.champion)
  },[props.champion,getCommonItemsChampion])

  return (
    <div className="columns is-centered is-mobile is-multiline has-text-centered">
      {(loaded) ? items?.map(item => (
        <div className="column is-narrow" key={item.item_name}>
          <Item item={item}/>
          <p>{item.uses}</p>
          <p className="is-size-7">{item.winrate}%W</p>
        </div>
      )):<></>}
    </div>
  )
}
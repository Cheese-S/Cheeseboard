import * as React from 'react'
import { useRecoilState } from 'recoil'
import { elementIDState } from '../../state'
import { CanvasItem } from '../CanvasItem/CanvasItem'

// import { Bound} from '../type';

// interface Camera extends Bound{
//     zoom: number
// }

// const CANVAS_SIZE = 65356; 

export const Canvas: React.FC = ({}) => {
    const [ids, setIds] = useRecoilState(elementIDState); 
    const addId = () => setIds((ids) => [...ids, 1]); 
    let pos = useMousePosition(); 
    return <div>
        <div> HELLO </div>
        <button onClick={addId}>
            CLICK ME
        </button>
        {ids.map((id) => {
            console.log(ids); 
            return <CanvasItem id={id}/>
        })}
    </ div>

}

export const useMousePosition = () => {
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    console.log(position);
  
    React.useEffect(() => {
      const setFromEvent = (e: any) => setPosition({ x: e.clientX, y: e.clientY });
      window.addEventListener("mousemove", setFromEvent);
  
      return () => {
        window.removeEventListener("mousemove", setFromEvent);
      };
    }, []);
  
    return position;
  };
  



